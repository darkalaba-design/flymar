import { guard, json, apiError } from "@/lib/admin/http";
import { getRepository } from "@/lib/admin/repository";
import { buildSummary } from "@/lib/admin/report";
import { publicSettings } from "@/lib/admin/telegram";
export async function GET(request: Request) {
  try {
    const denied = await guard(request);
    if (denied) return denied;
    const requested = Number(new URL(request.url).searchParams.get("days"));
    const days = [7, 30, 90].includes(requested) ? requested : 30;
    const store = getRepository();
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const since = today.getTime() - (days - 1) * 86400000;
    const [events, leads, settings] = await Promise.all([
      store.eventsSince(since),
      store.leadsSince(since),
      store.getSettings(),
    ]);
    return json({
      summary: buildSummary(events, leads, days),
      leads: leads.slice(0, 200),
      settings: publicSettings(settings),
      mode: store.mode,
      startedAt: store.startedAt,
    });
  } catch (error) {
    return apiError(error);
  }
}
