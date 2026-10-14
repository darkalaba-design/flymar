import { readFile } from "node:fs/promises";
import pg from "pg";
import nextEnv from "@next/env";
nextEnv.loadEnvConfig(process.cwd());
if (!process.env.DATABASE_URL) {
  console.error("Set DATABASE_URL before initializing the database.");
  process.exit(1);
}
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});
try {
  await client.connect();
  await client.query(
    await readFile(new URL("../db/001-admin.sql", import.meta.url), "utf8"),
  );
  console.log("FLYMAR admin tables are ready.");
} catch {
  console.error(
    "Database initialization failed. Check connectivity, TLS and schema permissions.",
  );
  process.exitCode = 1;
} finally {
  await client.end();
}
