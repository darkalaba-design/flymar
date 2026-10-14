import { guard, json, bodyJson } from "@/lib/admin/http";
import { readTheme, saveTheme } from "@/lib/design/store";
import { validateTheme } from "@/lib/design/theme";
export const runtime = "nodejs";
export async function PUT(request: Request) {
  try {
    const denied = await guard(request);
    if (denied) return denied;
    const body = await bodyJson(request, 8192);
    if (
      typeof body.revision !== "string" ||
      !/^[a-f0-9]{64}$/.test(body.revision)
    )
      return json({ error: "invalid_theme" }, 400);
    return json(await saveTheme(validateTheme(body.theme), body.revision));
  } catch (error) {
    const reason = error instanceof Error ? error.message : "";
    if (reason === "theme_conflict")
      return json({ error: reason, current: await readTheme() }, 409);
    if (reason === "invalid_theme" || reason === "invalid_body")
      return json({ error: "invalid_theme" }, 400);
    return json({ error: "theme_storage_unavailable" }, 503);
  }
}
