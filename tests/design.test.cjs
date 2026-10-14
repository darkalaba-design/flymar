const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const ts = require("typescript");
require.extensions[".ts"] = (module, filename) =>
  module._compile(
    ts.transpileModule(
      fs
        .readFileSync(filename, "utf8")
        .replace(/^import "server-only";\s*/m, ""),
      {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2022,
          esModuleInterop: true,
        },
      },
    ).outputText,
    filename,
  );
const {
  defaults,
  validateTheme,
  themeCss,
  themeVariables,
  presets,
  contrast,
} = require("../src/lib/design/theme.ts");

test("theme validation accepts presets and rejects CSS injection and invalid ranges", () => {
  for (const p of Object.values(presets))
    assert.deepEqual(validateTheme(p.theme), p.theme);
  for (const patch of [
    { ink: "red;}</style><script>alert(1)</script>" },
    { font: "url(https://example.com)" },
    { density: 100 },
    { motion: -1 },
    { bodyScale: NaN },
    { extra: "x" },
    { radius: "20px" },
  ])
    assert.throws(() => validateTheme({ ...defaults, ...patch }));
  assert.throws(() => validateTheme({ ink: "#000000" }));
  assert.throws(() => validateTheme([]));
  assert.ok(!themeCss(defaults).includes("</"));
});
test("tokens export and contrast calculation preserve expected values", () => {
  assert.equal(themeVariables(defaults)["--fm-radius"], "2px");
  assert.equal(themeVariables(defaults)["--fm-motion"], "1");
  assert.equal(contrast("#000000", "#ffffff"), 21);
  assert.ok(contrast(defaults.ink, defaults.paper) > 12);
});
test("all site CSS foundation references resolve, without raw palette or font sizes", () => {
  const files = [
    "src/app/foundations.css",
    "src/app/globals.css",
    "src/app/fleet.css",
    "src/app/positioning.css",
    "src/app/company.css",
    "src/components/business-benefits.module.css",
    "src/components/ui-kit/ui-kit.module.css",
    "src/app/design-system.css",
  ];
  const css = files.map((f) =>
    fs.readFileSync(path.join(__dirname, "..", f), "utf8"),
  );
  const all = css.join("\n");
  assert.ok(!/--fm-tracking-0:\s*calc\(0\s*\*/.test(all), "zero tracking must have a length unit so nested labels do not inherit negative tracking");
  const defined = new Set(
    [...all.matchAll(/(--fm-[\w-]+)\s*:/g)].map((m) => m[1]),
  );
  for (const [, name] of all.matchAll(/var\((--fm-[\w-]+)/g))
    assert.ok(defined.has(name), name);
  for (const s of css.slice(1, 6)) {
    assert.ok(!/#[0-9a-f]{3,8}\b/i.test(s));
    assert.ok(!/font-size:\s*(?:\d|clamp)/.test(s));
  }
});
test("local theme persists, rejects concurrent stale writes, and fails closed in production", async () => {
  const oldCwd = process.cwd(),
    oldEnv = process.env.NODE_ENV,
    oldDb = process.env.DATABASE_URL;
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "flymar-theme-test-"));
  try {
    fs.mkdirSync(path.join(temp, "theme"));
    fs.writeFileSync(
      path.join(temp, "theme/site-theme.json"),
      JSON.stringify(defaults),
    );
    process.chdir(temp);
    process.env.NODE_ENV = "development";
    delete process.env.DATABASE_URL;
    const { readTheme, saveTheme } = require("../src/lib/design/store.ts");
    const initial = await readTheme();
    assert.equal(initial.storage, "file");
    const results = await Promise.allSettled([
      saveTheme(presets.ocean.theme, initial.revision),
      saveTheme(presets.editorial.theme, initial.revision),
    ]);
    assert.equal(results.filter((r) => r.status === "fulfilled").length, 1, results.map(r => r.status === "rejected" ? String(r.reason) : "ok").join("; "));
    assert.equal(
      results.find((r) => r.status === "rejected").reason.message,
      "theme_conflict",
    );
    const persisted = await readTheme();
    assert.notEqual(initial.revision, persisted.revision);
    assert.deepEqual(
      JSON.parse(fs.readFileSync(path.join(temp, "theme/site-theme.json"))),
      persisted.theme,
    );
    process.env.NODE_ENV = "production";
    await assert.rejects(
      saveTheme(defaults, persisted.revision),
      /database_not_connected/,
    );
    assert.equal((await readTheme()).storage, "readonly");
    fs.writeFileSync(path.join(temp, "theme/site-theme.json"), "invalid");
    const fallback = await readTheme();
    assert.equal(fallback.available, false);
    assert.deepEqual(fallback.theme, defaults);
  } finally {
    process.chdir(oldCwd);
    if (oldEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = oldEnv;
    if (oldDb === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = oldDb;
    // Exact temporary test directory, never a computed parent/workspace path.
    assert.equal(path.dirname(path.resolve(temp)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(temp).startsWith("flymar-theme-test-"));
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
