import "server-only";
import { readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { Pool } from "pg";
import { defaults, validateTheme, type Theme } from "./theme";

export type ThemeSnapshot = {
  theme: Theme;
  revision: string;
  storage: "file" | "database" | "readonly";
  available: boolean;
};
const file = path.join(process.cwd(), "theme/site-theme.json");
const runtime = globalThis as typeof globalThis & {
  flymarThemePool?: Pool;
  flymarThemeWrite?: Promise<unknown>;
};
function pool() {
  if (!process.env.DATABASE_URL) throw new Error("database_not_connected");
  if (!runtime.flymarThemePool) {
    runtime.flymarThemePool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 2,
      connectionTimeoutMillis: 3000,
      statement_timeout: 5000,
      idleTimeoutMillis: 30000,
    });
    runtime.flymarThemePool.on("error", () =>
      console.error("FLYMAR: theme database unavailable"),
    );
  }
  return runtime.flymarThemePool;
}
export const revisionOf = (theme: Theme) =>
  createHash("sha256")
    .update(JSON.stringify(validateTheme(theme)))
    .digest("hex");
async function fileTheme() {
  return validateTheme(JSON.parse(await readFile(file, "utf8")));
}
export async function readTheme(): Promise<ThemeSnapshot> {
  let theme: Theme = { ...defaults };
  let available = true;
  const storage = process.env.DATABASE_URL
    ? "database"
    : process.env.NODE_ENV === "production"
      ? "readonly"
      : "file";
  try {
    theme = await fileTheme();
  } catch {
    available = false;
  }
  if (storage === "database") {
    try {
      const r = await pool().query(
        "SELECT data FROM flymar_settings WHERE id='site-theme'",
      );
      if (r.rows[0]) theme = validateTheme(r.rows[0].data);
      available = true;
    } catch {
      available = false;
    }
  }
  return { theme, revision: revisionOf(theme), storage, available };
}

export async function saveTheme(
  theme: Theme,
  revision: string,
): Promise<ThemeSnapshot> {
  theme = validateTheme(theme);
  if (process.env.DATABASE_URL) {
    const db = await pool().connect();
    try {
      await db.query("BEGIN");
      await db.query("SELECT pg_advisory_xact_lock(8112026)");
      const r = await db.query(
        "SELECT data FROM flymar_settings WHERE id='site-theme'",
      );
      const current = r.rows[0]
        ? validateTheme(r.rows[0].data)
        : await fileTheme();
      if (revisionOf(current) !== revision) throw new Error("theme_conflict");
      await db.query(
        "INSERT INTO flymar_settings(id,data) VALUES('site-theme',$1) ON CONFLICT(id) DO UPDATE SET data=EXCLUDED.data",
        [theme],
      );
      await db.query("COMMIT");
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    } finally {
      db.release();
    }
    return {
      theme,
      revision: revisionOf(theme),
      storage: "database",
      available: true,
    };
  }
  if (process.env.NODE_ENV === "production")
    throw new Error("database_not_connected");
  // Serialize local writes and replace atomically; the file is versioned with the site.
  const run = async () => {
    const current = await fileTheme();
    if (revisionOf(current) !== revision) throw new Error("theme_conflict");
    const tmp = `${file}.${randomUUID()}.tmp`;
    await writeFile(tmp, JSON.stringify(theme, null, 2) + "\n");
    await rename(tmp, file);
    return {
      theme,
      revision: revisionOf(theme),
      storage: "file",
      available: true,
    } as ThemeSnapshot;
  };
  const pending = (runtime.flymarThemeWrite ?? Promise.resolve())
    .catch(() => {})
    .then(run);
  runtime.flymarThemeWrite = pending;
  return pending;
}
