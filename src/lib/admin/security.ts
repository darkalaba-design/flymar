import "server-only";
import {
  createHash,
  randomBytes,
  scrypt,
  timingSafeEqual,
  createCipheriv,
  createDecipheriv,
} from "node:crypto";
import { cookies } from "next/headers";
import { getRepository } from "./repository";

export const SESSION_COOKIE = "flymar_admin";
export const SESSION_AGE = 8 * 60 * 60;
export const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export function credentialVersion() {
  return digest(process.env.ADMIN_PASSWORD_HASH ?? "");
}
export function sameOrigin(request: Request) {
  try {
    const origin = new URL(request.headers.get("origin") ?? "").origin;
    // Next's local Request URL may use localhost even when the browser uses 127.0.0.1.
    // Host is browser-controlled, unlike a caller-supplied forwarded-host header.
    const expected = new URL(request.url);
    if (request.headers.get("host"))
      expected.host = request.headers.get("host")!;
    const configured =
      process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SITE_URL;
    return (
      origin === (configured ? new URL(configured).origin : expected.origin)
    );
  } catch {
    return false;
  }
}
export function clientRateKey(request: Request) {
  // Only enable a proxy header when the ingress overwrites it (never trust arbitrary XFF).
  const header = process.env.TRUSTED_CLIENT_IP_HEADER;
  const value = header
    ? request.headers.get(header)?.split(",")[0].trim()
    : "shared";
  return digest(value?.slice(0, 100) || "shared");
}
export async function verifyCredentials(username: unknown, password: unknown) {
  const saved = process.env.ADMIN_PASSWORD_HASH;
  if (!saved) throw new Error("auth_not_configured");
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    username.length > 100 ||
    password.length > 256
  )
    return false;
  const [scheme, salt, expected] = saved.split(":");
  if (
    scheme !== "scrypt" ||
    !/^[a-f0-9]{32}$/.test(salt ?? "") ||
    !/^[a-f0-9]{128}$/.test(expected ?? "")
  )
    throw new Error("auth_not_configured");
  const actual = await new Promise<Buffer>((resolve, reject) =>
    scrypt(password, salt, 64, (error, key) =>
      error ? reject(error) : resolve(key),
    ),
  );
  const validPassword = timingSafeEqual(actual, Buffer.from(expected, "hex"));
  const validName = timingSafeEqual(
    Buffer.from(digest(username)),
    Buffer.from(digest(process.env.ADMIN_USERNAME || "admin")),
  );
  return validName && validPassword;
}
export async function readSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const session = await getRepository().getSession(digest(token));
  return session?.credentialVersion === credentialVersion() ? session : null;
}
export async function newSession() {
  const token = randomBytes(32).toString("hex");
  await getRepository().saveSession(digest(token), {
    createdAt: Date.now(),
    expires: Date.now() + SESSION_AGE * 1000,
    credentialVersion: credentialVersion(),
  });
  return token;
}
function encryptionKey() {
  const key = process.env.ADMIN_ENCRYPTION_KEY;
  if (!key || !/^[a-f0-9]{64}$/.test(key))
    throw new Error("encryption_not_configured");
  return Buffer.from(key, "hex");
}
export function sealToken(token: string) {
  const iv = randomBytes(12),
    cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(token, "utf8"),
    cipher.final(),
  ]);
  return [iv, cipher.getAuthTag(), encrypted]
    .map((x) => x.toString("base64url"))
    .join(".");
}
export function openToken(encrypted: string) {
  if (!encrypted) return "";
  const [iv, tag, content] = encrypted
    .split(".")
    .map((x) => Buffer.from(x, "base64url"));
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(content), decipher.final()]).toString(
    "utf8",
  );
}
