import { readFile, writeFile } from "node:fs/promises";
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline/promises";
// Password input is hidden; neither the password nor the resulting secrets are logged.
if (!process.stdin.isTTY)
  throw new Error("Run this command in an interactive terminal.");
let existing = "";
try {
  existing = await readFile(".env.local", "utf8");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const input = createInterface({ input: process.stdin, output: process.stdout });
const username =
  (await input.question("Admin login [admin]: ")).trim() || "admin";
input.close();
async function secret(prompt) {
  process.stdout.write(prompt);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  return new Promise((resolve, reject) => {
    let value = "";
    function done(error) {
      process.stdin.off("data", handler);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write("\n");
      error ? reject(error) : resolve(value);
    }
    function handler(buffer) {
      for (const char of buffer.toString()) {
        if (char === "\u0003") return done(new Error("Cancelled"));
        if (char === "\r" || char === "\n") return done();
        if (char === "\u007f" || char === "\b") value = value.slice(0, -1);
        else if (char >= " ") value += char;
      }
    }
    process.stdin.on("data", handler);
  });
}
const password = await secret("Password (hidden): ");
const confirm = await secret("Confirm password: ");
if (password !== confirm || password.length < 10 || password.length > 256)
  throw new Error("Passwords must match and contain 10–256 characters.");
if (!/^[A-Za-z0-9_.-]{1,100}$/.test(username))
  throw new Error("Use letters, numbers, underscore, dot or dash in login.");
const salt = randomBytes(16).toString("hex");
const hash = `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
const existingKey = existing.match(/^ADMIN_ENCRYPTION_KEY=(.+)$/m)?.[1]?.trim();
if (existingKey && !/^[a-f0-9]{64}$/.test(existingKey))
  throw new Error(
    "Existing encryption key is invalid. Restore it before changing credentials.",
  );
const updates = {
  ADMIN_USERNAME: username,
  ADMIN_PASSWORD_HASH: hash,
  ADMIN_ENCRYPTION_KEY: existingKey || randomBytes(32).toString("hex"),
};
for (const [key, value] of Object.entries(updates)) {
  const pattern = new RegExp(`^${key}=.*$`, "m");
  existing = pattern.test(existing)
    ? existing.replace(pattern, `${key}=${value}`)
    : `${existing.trimEnd()}\n${key}=${value}\n`;
}
await writeFile(".env.local", existing, { mode: 0o600 });
console.log(
  "Local admin configured. Restart the server. .env.local must remain outside Git.",
);
