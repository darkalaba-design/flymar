import type { Attribution, VisitEvent, Lead, Summary } from "./types";
export const emptyAttribution: Attribution = {
  source: "",
  medium: "",
  campaign: "",
  term: "",
  content: "",
  landing: "/",
};
export function cleanAttribution(raw: unknown): Attribution {
  const value =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return Object.fromEntries(
    Object.entries(emptyAttribution).map(([key, fallback]) => [
      key,
      typeof value[key] === "string"
        ? String(value[key])
            .replace(/[\x00-\x1f]/g, "")
            .slice(0, key === "landing" ? 200 : 120)
        : fallback,
    ]),
  ) as Attribution;
}
// Sessions are per browser tab, renewed after 30 minutes of inactivity. Not people.
// Conversion uses distinct sessions with a server-accepted enquiry, not client success events.
export function buildSummary(
  events: VisitEvent[],
  leads: Lead[],
  days: number,
  now = Date.now(),
): Summary {
  const today = new Date(now);
  today.setUTCHours(0, 0, 0, 0);
  const since = today.getTime() - (days - 1) * 86400000;
  const selected = events.filter((e) => e.at >= since && e.at <= now);
  const selectedLeads = leads.filter((e) => e.at >= since && e.at <= now);
  const pageViews = selected.filter((e) => e.event === "page_view");
  const sessions = new Map<string, VisitEvent>();
  for (const e of pageViews.sort((a, b) => a.at - b.at))
    if (!sessions.has(e.sessionId)) sessions.set(e.sessionId, e);
  const converted = new Set(
    selectedLeads
      .filter((l) => sessions.has(l.sessionId))
      .map((l) => l.sessionId),
  );
  const daily: Summary["daily"] = Array.from({ length: days }, (_, i) => ({
    day: new Date(since + i * 86400000).toISOString().slice(0, 10),
    views: 0,
    leads: 0,
  }));
  for (const e of pageViews)
    daily.find((d) => d.day === new Date(e.at).toISOString().slice(0, 10))!
      .views++;
  for (const l of selectedLeads)
    daily.find((d) => d.day === new Date(l.at).toISOString().slice(0, 10))!
      .leads++;
  const sourceMap = new Map<
    string,
    Summary["sources"][number] & { ids: Set<string>; converted: Set<string> }
  >();
  for (const [sessionId, event] of sessions) {
    const a = event.attribution,
      key = JSON.stringify([a.source, a.medium, a.campaign, a.term, a.content]);
    const row = sourceMap.get(key) ?? {
      source: a.source || "Прямой / без метки",
      medium: a.medium,
      campaign: a.campaign,
      term: a.term,
      content: a.content,
      sessions: 0,
      leads: 0,
      conversion: 0,
      ids: new Set(),
      converted: new Set(),
    };
    row.ids.add(sessionId);
    if (converted.has(sessionId)) row.converted.add(sessionId);
    sourceMap.set(key, row);
  }
  for (const row of sourceMap.values())
    row.leads = selectedLeads.filter((l) => row.ids.has(l.sessionId)).length;
  const pageMap = new Map<string, number>();
  for (const e of pageViews)
    pageMap.set(e.path, (pageMap.get(e.path) || 0) + 1);
  return {
    days,
    views: pageViews.length,
    sessions: sessions.size,
    starts: new Set(
      selected.filter((e) => e.event === "form_start").map((e) => e.sessionId),
    ).size,
    submissions: selected.filter((e) => e.event === "form_submit").length,
    leads: selectedLeads.length,
    conversion: sessions.size ? (converted.size / sessions.size) * 100 : 0,
    daily,
    sources: [...sourceMap.values()]
      .map(({ ids, converted, ...row }) => ({
        ...row,
        sessions: ids.size,
        conversion: ids.size ? (converted.size / ids.size) * 100 : 0,
      }))
      .sort((a, b) => b.sessions - a.sessions),
    pages: [...pageMap]
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views),
  };
}
