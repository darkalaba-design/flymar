import { json, bodyJson, apiError } from "@/lib/admin/http";
import { getRepository } from "@/lib/admin/repository";
import {
  sameOrigin,
  clientRateKey,
  verifyCredentials,
  newSession,
  SESSION_COOKIE,
  SESSION_AGE,
} from "@/lib/admin/security";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    if (!sameOrigin(request)) return json({ error: "forbidden" }, 403);
    const store = getRepository();
    // The account-wide bucket cannot be bypassed by changing usernames or proxy headers.
    const global = await store.consumeRate("login:account", 10, 15 * 60 * 1000);
    const client = await store.consumeRate(
      `login:${clientRateKey(request)}`,
      5,
      15 * 60 * 1000,
    );
    if (!global.allowed || !client.allowed) {
      const seconds = Math.max(
        global.allowed ? 0 : global.retryAfter,
        client.allowed ? 0 : client.retryAfter,
      );
      return json({ error: "rate_limited", retryAfter: seconds }, 429, {
        "Retry-After": String(seconds),
      });
    }
    const data = await bodyJson(request, 2048);
    if (!(await verifyCredentials(data.username, data.password)))
      return json({ error: "invalid_credentials" }, 401);
    const token = await newSession();
    const response = json({ ok: true });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_AGE,
    });
    return response;
  } catch (error) {
    return apiError(error);
  }
}
