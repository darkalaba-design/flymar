export type AnalyticsEvent =
  | "page_view"
  | "section_view"
  | "cta_click"
  | "modal_open"
  | "form_start"
  | "form_submit"
  | "form_success"
  | "form_error"
  | "hero_change";
/** No form values, email addresses, query strings or persistent identifiers are collected. */
export function track(
  event: AnalyticsEvent,
  properties: Record<string, string | number> = {},
) {
  if (typeof window === "undefined") return;
  const payload = {
    event,
    properties,
    path: window.location.pathname,
    timestamp: new Date().toISOString(),
  };
  window.dispatchEvent(
    new CustomEvent("flymar:analytics", { detail: payload }),
  );
  const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
  if (!endpoint || navigator.doNotTrack === "1") return;
  void fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
    credentials: "omit",
  }).catch(() => {});
}
