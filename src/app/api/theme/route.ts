import { readTheme } from "@/lib/design/store";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  const { theme, revision } = await readTheme();
  return NextResponse.json(
    { theme, revision },
    { headers: { "Cache-Control": "no-store" } },
  );
}
