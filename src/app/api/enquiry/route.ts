import { NextResponse } from "next/server";
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== request.headers.get("host"))
        return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    } catch {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }
  }
  if (Number(request.headers.get("content-length") ?? 0) > 12000)
    return NextResponse.json({ error: "Too large" }, { status: 413 });
  let data;
  try {
    const body = await request.text();
    if (body.length > 12000)
      return NextResponse.json({ error: "Too large" }, { status: 413 });
    data = JSON.parse(body);
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
  if (!process.env.LEADS_ENDPOINT)
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  try {
    const result = await fetch(process.env.LEADS_ENDPOINT, {
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
        company: data.company?.trim() ?? "",
        message: data.message?.trim() ?? "",
        locale: data.locale,
        consent: true,
        source: "flymar-home",
        submittedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!result.ok)
      return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  }
}
