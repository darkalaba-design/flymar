import { apiError, bodyJson, json } from "@/lib/admin/http";
import { getRepository } from "@/lib/admin/repository";
import { sameOrigin, clientRateKey } from "@/lib/admin/security";
import { cleanAttribution } from "@/lib/admin/report";
import { eventNames, type EventName } from "@/lib/admin/types";
export async function POST(request: Request) {
  try {
    if (!sameOrigin(request)) return json({ error: "forbidden" }, 403);
    if (request.headers.get("dnt") === "1")
      return new Response(null, { status: 204 });
    const store = getRepository();
    const rate = await store.consumeRate(
      `events:${clientRateKey(request)}`,
      600,
      60000,
    );
    if (!rate.allowed) return json({ error: "rate_limited" }, 429);
    const data = await bodyJson(request, 4096);
    if (
      typeof data.id !== "string" ||
      !/^[a-f0-9-]{36}$/.test(data.id) ||
      typeof data.sessionId !== "string" ||
      !/^[a-f0-9-]{36}$/.test(data.sessionId) ||
      !eventNames.includes(data.event as EventName) ||
      typeof data.path !== "string" ||
      !/^\/(?:ru\/?|(?:ru\/)?(?:models\/(?:f8|f11)|about|contacts|technology))?$/.test(
        data.path,
      )
    )
      return json({ error: "invalid_event" }, 400);
    await store.addEvent({
      id: data.id,
      sessionId: data.sessionId,
      event: data.event as EventName,
      path: data.path,
      at: Date.now(),
      attribution: cleanAttribution(data.attribution),
    });
    return new Response(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}
