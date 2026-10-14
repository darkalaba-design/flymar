const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
const crypto = require("node:crypto");
// Compile our server modules for Node's test runner; Next enforces server-only in the app build.
require.extensions[".ts"] = (module, filename) => {
  const source = fs
    .readFileSync(filename, "utf8")
    .replace(/^import "server-only";\s*/m, "");
  module._compile(
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );
};
const {
  buildSummary,
  emptyAttribution,
  cleanAttribution,
} = require("../src/lib/admin/report.ts");
const {
  MemoryRepository,
  getRepository,
} = require("../src/lib/admin/repository.ts");
const {
  sealToken,
  openToken,
  verifyCredentials,
  sameOrigin,
} = require("../src/lib/admin/security.ts");
const {
  notifyTelegram,
  publicSettings,
} = require("../src/lib/admin/telegram.ts");
const now = Date.UTC(2026, 9, 13, 15);
const event = (
  id,
  sessionId,
  event = "page_view",
  at = now,
  source = "campaign-a",
) => ({
  id,
  sessionId,
  event,
  at,
  path: "/",
  attribution: { ...emptyAttribution, source },
});
const lead = (id, sessionId, at = now) => ({
  id,
  sessionId,
  at,
  name: "Test",
  email: "test@example.invalid",
  company: "",
  message: "Test only",
  locale: "en",
  status: "preview",
  telegram: "disabled",
  webhook: "disabled",
  attribution: { ...emptyAttribution },
});

test("conversion counts distinct sessions and ignores client-reported form success", () => {
  const s = buildSummary(
    [
      event("1", "a"),
      event("2", "a"),
      event("3", "b"),
      event("4", "b", "form_success"),
    ],
    [lead("l1", "a"), lead("l2", "a")],
    7,
    now,
  );
  assert.equal(s.views, 3);
  assert.equal(s.sessions, 2);
  assert.equal(s.leads, 2);
  assert.equal(s.conversion, 50);
});
test("first-touch UTM is retained and different terms/content stay separate", () => {
  const events = [
    event("1", "a", "page_view", now - 1, "first"),
    event("2", "a", "page_view", now, "second"),
    event("3", "b"),
  ];
  events[2].attribution.content = "variant-b";
  const s = buildSummary(events, [lead("l1", "a")], 7, now);
  assert.equal(s.sources.length, 2);
  assert.equal(s.sources.find((r) => r.source === "first").leads, 1);
  assert.ok(!s.sources.some((r) => r.source === "second"));
});
test("UTC period boundaries exclude old and future events", () => {
  const start = Date.UTC(2026, 9, 7);
  const s = buildSummary(
    [
      event("old", "a", "page_view", start - 1),
      event("inside", "b", "page_view", start),
      event("future", "c", "page_view", now + 1),
    ],
    [],
    7,
    now,
  );
  assert.equal(s.views, 1);
  assert.equal(s.daily.length, 7);
  assert.equal(s.daily[0].views, 1);
  assert.equal(cleanAttribution({ source: "a\n\0b", medium: 42 }).source, "ab");
});
test("simultaneous attempts cannot bypass the memory rate limiter; expiry reopens it", async (t) => {
  t.mock.timers.enable({ apis: ["Date"], now });
  const store = new MemoryRepository();
  const result = await Promise.all(
    Array.from({ length: 30 }, () => store.consumeRate("login", 5, 900000)),
  );
  assert.equal(result.filter((r) => r.allowed).length, 5);
  assert.equal(result[29].retryAfter, 900);
  t.mock.timers.tick(900001);
  assert.equal((await store.consumeRate("login", 5, 900000)).allowed, true);
});
test("duplicate enquiries do not multiply records; reads cannot mutate stored data", async () => {
  const store = new MemoryRepository();
  const record = lead("id", "session");
  assert.equal(await store.addLead(record), true);
  assert.equal(await store.addLead(record), false);
  const rows = await store.leadsSince(0);
  rows[0].name = "Changed";
  assert.equal((await store.leadsSince(0))[0].name, "Test");
});
test("expired and logged-out sessions cannot be reused", async () => {
  const store = new MemoryRepository();
  await store.saveSession("expired", {
    expires: Date.now() - 1,
    createdAt: 0,
    credentialVersion: "v",
  });
  assert.equal(await store.getSession("expired"), null);
  await store.saveSession("valid", {
    expires: Date.now() + 10000,
    createdAt: Date.now(),
    credentialVersion: "v",
  });
  assert.ok(await store.getSession("valid"));
  await store.deleteSession("valid");
  assert.equal(await store.getSession("valid"), null);
});
test("credentials are validated with the configured scrypt hash", async () => {
  const oldHash = process.env.ADMIN_PASSWORD_HASH,
    oldUser = process.env.ADMIN_USERNAME;
  try {
    const salt = crypto.randomBytes(16).toString("hex");
    process.env.ADMIN_PASSWORD_HASH = `scrypt:${salt}:${crypto.scryptSync("test-password-only", salt, 64).toString("hex")}`;
    process.env.ADMIN_USERNAME = "admin";
    assert.equal(await verifyCredentials("admin", "test-password-only"), true);
    assert.equal(await verifyCredentials("admin", "wrong"), false);
    assert.equal(await verifyCredentials("other", "test-password-only"), false);
  } finally {
    oldHash === undefined
      ? delete process.env.ADMIN_PASSWORD_HASH
      : (process.env.ADMIN_PASSWORD_HASH = oldHash);
    oldUser === undefined
      ? delete process.env.ADMIN_USERNAME
      : (process.env.ADMIN_USERNAME = oldUser);
  }
});
test("encrypted bot token roundtrips, detects tampering, and is absent from public settings", () => {
  const previous = process.env.ADMIN_ENCRYPTION_KEY;
  try {
    process.env.ADMIN_ENCRYPTION_KEY = crypto.randomBytes(32).toString("hex");
    const token = "123456:test-token-for-unit-tests-only",
      encrypted = sealToken(token);
    assert.equal(openToken(encrypted), token);
    assert.ok(!encrypted.includes(token));
    const pieces = encrypted.split(".");
    const content = Buffer.from(pieces[2], "base64url");
    content[0] ^= 1;
    pieces[2] = content.toString("base64url");
    assert.throws(() => openToken(pieces.join(".")));
    const settings = publicSettings({
      encryptedToken: encrypted,
      recipients: [],
      enabled: false,
      updatedAt: 0,
    });
    assert.equal(settings.hasToken, true);
    assert.ok(!JSON.stringify(settings).includes(encrypted));
  } finally {
    previous === undefined
      ? delete process.env.ADMIN_ENCRYPTION_KEY
      : (process.env.ADMIN_ENCRYPTION_KEY = previous);
  }
});
test("origin validation accepts local Host and rejects cross-origin or absent Origin", () => {
  const valid = new Request("http://localhost:3000/api/admin/login", {
    headers: { Host: "127.0.0.1:3000", Origin: "http://127.0.0.1:3000" },
  });
  assert.equal(sameOrigin(valid), true);
  assert.equal(
    sameOrigin(
      new Request(valid, {
        headers: { Host: "127.0.0.1:3000", Origin: "https://attacker.invalid" },
      }),
    ),
    false,
  );
  assert.equal(
    sameOrigin(new Request(valid, { headers: { Host: "127.0.0.1:3000" } })),
    false,
  );
});
test("production refuses ephemeral storage", () => {
  const mode = process.env.NODE_ENV,
    url = process.env.DATABASE_URL;
  try {
    process.env.NODE_ENV = "production";
    delete process.env.DATABASE_URL;
    assert.throws(() => getRepository(), /database_not_connected/);
  } finally {
    mode === undefined
      ? delete process.env.NODE_ENV
      : (process.env.NODE_ENV = mode);
    url === undefined
      ? delete process.env.DATABASE_URL
      : (process.env.DATABASE_URL = url);
  }
});
test("Telegram transport is disabled by default and aggregates partial delivery without a real request", async () => {
  const flag = process.env.TELEGRAM_DELIVERY_ENABLED,
    key = process.env.ADMIN_ENCRYPTION_KEY,
    original = global.fetch;
  try {
    process.env.TELEGRAM_DELIVERY_ENABLED = "false";
    global.fetch = () => {
      throw new Error("Unexpected outgoing request");
    };
    const settings = {
      encryptedToken: "",
      enabled: true,
      updatedAt: 0,
      recipients: [
        { id: "1", name: "One", chatId: "123456", enabled: true },
        { id: "2", name: "Two", chatId: "234567", enabled: true },
      ],
    };
    assert.equal(
      await notifyTelegram(lead("id", "session"), settings),
      "disabled",
    );
    process.env.ADMIN_ENCRYPTION_KEY = crypto.randomBytes(32).toString("hex");
    settings.encryptedToken = sealToken(
      "123456:test-token-for-unit-tests-only",
    );
    process.env.TELEGRAM_DELIVERY_ENABLED = "true";
    let calls = 0;
    global.fetch = async () =>
      new Response(JSON.stringify({ ok: ++calls === 1 }), { status: 200 });
    assert.equal(
      await notifyTelegram(lead("id", "session"), settings),
      "partial",
    );
    assert.equal(calls, 2);
  } finally {
    global.fetch = original;
    flag === undefined
      ? delete process.env.TELEGRAM_DELIVERY_ENABLED
      : (process.env.TELEGRAM_DELIVERY_ENABLED = flag);
    key === undefined
      ? delete process.env.ADMIN_ENCRYPTION_KEY
      : (process.env.ADMIN_ENCRYPTION_KEY = key);
  }
});
