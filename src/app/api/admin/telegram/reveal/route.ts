import { guard, json, apiError } from "@/lib/admin/http";
import { getRepository } from "@/lib/admin/repository";
import { openToken } from "@/lib/admin/security";
export async function POST(request: Request) {
  try {
    const denied = await guard(request);
    if (denied) return denied;
    const store = getRepository(),
      limit = await store.consumeRate("token:reveal", 10, 60000);
    if (!limit.allowed) return json({ error: "rate_limited" }, 429);
    return json({
      token: openToken((await store.getSettings()).encryptedToken),
    });
  } catch (error) {
    return apiError(error);
  }
}
