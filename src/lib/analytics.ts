import type { Attribution, EventName } from "./admin/types";
export type AnalyticsEvent = EventName;
type TrackingContext = {
  sessionId: string;
  attribution: Attribution;
  lastSeen: number;
};
let memoryContext: TrackingContext | null = null;
let lastPage = { path: "", at: 0 };
export function trackingContext(): TrackingContext | null {
  if (typeof window === "undefined" || navigator.doNotTrack === "1")
    return null;
  const now = Date.now();
  let previous = memoryContext;
  try {
    previous = JSON.parse(sessionStorage.getItem("flymar:session") || "null");
  } catch {
    /* storage can be blocked */
  }
  if (
    !previous ||
    typeof previous.sessionId !== "string" ||
    !previous.attribution ||
    !Number.isFinite(previous.lastSeen) ||
    now - previous.lastSeen > 30 * 60 * 1000
  ) {
    const query = new URLSearchParams(location.search);
    const tag = (name: string) =>
      (query.get(`utm_${name}`) || "").slice(0, 120);
    previous = {
      sessionId: crypto.randomUUID(),
      lastSeen: now,
      attribution: {
        source: tag("source"),
        medium: tag("medium"),
        campaign: tag("campaign"),
        term: tag("term"),
        content: tag("content"),
        landing: location.pathname,
      },
    };
  }
  previous.lastSeen = now;
  memoryContext = previous;
  try {
    sessionStorage.setItem("flymar:session", JSON.stringify(previous));
  } catch {
    /* fallback is scoped to this page */
  }
  return previous;
}
/** Only UTM fields, public paths and tab-scoped session IDs; never form contents. */
export function track(
  event: AnalyticsEvent,
  properties: Record<string, string | number> = {},
) {
  if (typeof window === "undefined" || location.pathname.startsWith("/admin"))
    return;
  const path = location.pathname;
  if (event === "page_view") {
    if (lastPage.path === path && Date.now() - lastPage.at < 1000) return;
    lastPage = { path, at: Date.now() };
  }
  const context = trackingContext();
  const payload = {
    id: crypto.randomUUID(),
    event,
    properties,
    path,
    timestamp: new Date().toISOString(),
    sessionId: context?.sessionId,
    attribution: context?.attribution,
  };
  window.dispatchEvent(
    new CustomEvent("flymar:analytics", { detail: payload }),
  );
  if (!context) return;
  const endpoints = new Set(
    ["/api/analytics", process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT].filter(
      Boolean,
    ),
  );
  for (const endpoint of endpoints)
    void fetch(endpoint!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
      credentials: "omit",
    }).catch(() => {});
}
