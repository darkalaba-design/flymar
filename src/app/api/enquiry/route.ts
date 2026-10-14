import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getRepository } from "@/lib/admin/repository";
import { cleanAttribution } from "@/lib/admin/report";
import { bodyJson } from "@/lib/admin/http";
import { clientRateKey, sameOrigin } from "@/lib/admin/security";
import { notifyTelegram } from "@/lib/admin/telegram";
import type { Lead } from "@/lib/admin/types";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (Number(request.headers.get("content-length") ?? 0) > 12000)
    return NextResponse.json({ error: "Too large" }, { status: 413 });
  let data;
  try {
    data = await bodyJson(request);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!data || typeof data !== "object")
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  if (data.website)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  if (
    typeof data.name !== "string" ||
    !data.name.trim() ||
    data.name.length > 120 ||
    typeof data.email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
    data.email.length > 254 ||
    data.consent !== true ||
    typeof data.locale !== "string" ||
    !["en", "ru"].includes(data.locale)
  )
    return NextResponse.json({ error: "Invalid details" }, { status: 400 });
  if (
    (data.company != null &&
      (typeof data.company !== "string" || data.company.length > 200)) ||
    (data.message != null &&
      (typeof data.message !== "string" || data.message.length > 3000))
  )
    return NextResponse.json({ error: "Invalid details" }, { status: 400 });
  try {
    const store = getRepository();
    const limit = await store.consumeRate(
      `lead:${clientRateKey(request)}`,
      10,
      10 * 60 * 1000,
    );
    if (!limit.allowed)
      return NextResponse.json(
        { error: "rate_limited" },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
      );
    const lead: Lead = {
      id:
        typeof data.requestId === "string" &&
        /^[a-f0-9-]{36}$/.test(data.requestId)
          ? data.requestId
          : randomUUID(),
      name: data.name.trim(),
      email: data.email.trim(),
      company: typeof data.company === "string" ? data.company.trim() : "",
      message: typeof data.message === "string" ? data.message.trim() : "",
      locale: String(data.locale),
      at: Date.now(),
      sessionId:
        typeof data.sessionId === "string" &&
        /^[a-f0-9-]{36}$/.test(data.sessionId)
          ? data.sessionId
          : "",
      attribution: cleanAttribution(data.attribution),
      status: store.mode === "preview" ? "preview" : "received",
      telegram: "disabled",
      webhook: "disabled",
    };
    const created = await store.addLead(lead);
    if (!created) return NextResponse.json({ ok: true, mode: store.mode });
    // The lead is accepted before any outbound delivery. Transport errors cannot lose it.
    let telegram: Lead["telegram"] = "failed";
    try {
      telegram = await notifyTelegram(lead, await store.getSettings());
    } catch {
      /* status stays failed */
    }
    let webhook: Lead["webhook"] = "disabled";
    if (process.env.LEADS_ENDPOINT) {
      try {
        const delivery = await fetch(process.env.LEADS_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(process.env.LEADS_API_TOKEN
              ? { Authorization: `Bearer ${process.env.LEADS_API_TOKEN}` }
              : {}),
          },
          body: JSON.stringify({
            name: data.name.trim(),
            email: data.email.trim(),
            company: lead.company,
            message: lead.message,
            locale: data.locale,
            consent: true,
            source: "flymar-home",
            submittedAt: new Date().toISOString(),
          }),
          signal: AbortSignal.timeout(10000),
        });
        webhook = delivery.ok ? "sent" : "failed";
      } catch {
        webhook = "failed";
      }
    }
    await store.updateLead(lead.id, { telegram, webhook });
    return NextResponse.json({ ok: true, mode: store.mode });
  } catch {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
}
