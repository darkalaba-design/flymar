import "server-only";
import { NextResponse } from "next/server";
import { readSession, sameOrigin } from "./security";
export function json(
  data: unknown,
  status = 200,
  extra: Record<string, string> = {},
) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store", ...extra },
  });
}
export async function bodyJson(
  request: Request,
  max = 12000,
): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new Error("invalid_body");
  if (Number(request.headers.get("content-length") || 0) > max)
    throw new Error("invalid_body");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("invalid_body");
  const parts: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      length += part.value.byteLength;
      if (length > max) {
        await reader.cancel();
        throw new Error("invalid_body");
      }
      parts.push(part.value);
    }
  } finally {
    reader.releaseLock();
  }
  const value: unknown = JSON.parse(Buffer.concat(parts).toString("utf8"));
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("invalid_body");
  return value as Record<string, unknown>;
}
export async function guard(request: Request) {
  if (request.method !== "GET" && !sameOrigin(request))
    return json({ error: "forbidden" }, 403);
  if (!(await readSession())) return json({ error: "unauthorized" }, 401);
  return null;
}
export function apiError(error: unknown) {
  if (
    error instanceof Error &&
    [
      "database_not_connected",
      "auth_not_configured",
      "encryption_not_configured",
      "preview_capacity",
    ].includes(error.message)
  )
    return json({ error: error.message }, 503);
  return json({ error: "invalid_request" }, 400);
}
