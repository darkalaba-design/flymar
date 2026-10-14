import { randomUUID } from "node:crypto";
import { guard, json, bodyJson, apiError } from "@/lib/admin/http";
import { getRepository } from "@/lib/admin/repository";
import { sealToken } from "@/lib/admin/security";
import { publicSettings } from "@/lib/admin/telegram";
import type { Recipient } from "@/lib/admin/types";
export async function PUT(request: Request) {
  try {
    const denied = await guard(request);
    if (denied) return denied;
    const store = getRepository(),
      data = await bodyJson(request);
    if (
      !Array.isArray(data.recipients) ||
      data.recipients.length > 10 ||
      typeof data.enabled !== "boolean"
    )
      return json({ error: "invalid_settings" }, 400);
    const recipients: Recipient[] = [];
    for (const raw of data.recipients) {
      if (
        !raw ||
        typeof raw !== "object" ||
        typeof raw.name !== "string" ||
        !raw.name.trim() ||
        raw.name.length > 80 ||
        typeof raw.chatId !== "string" ||
        !/^-?[1-9]\d{3,19}$/.test(raw.chatId) ||
        typeof raw.enabled !== "boolean"
      )
        return json({ error: "invalid_recipient" }, 400);
      if (recipients.some((r) => r.chatId === raw.chatId))
        return json({ error: "duplicate_recipient" }, 400);
      recipients.push({
        id:
          typeof raw.id === "string" && /^[a-f0-9-]{36}$/.test(raw.id)
            ? raw.id
            : randomUUID(),
        name: raw.name.trim(),
        chatId: raw.chatId,
        enabled: raw.enabled,
      });
    }
    const settings = await store.getSettings();
    if (data.token !== undefined && data.token !== "") {
      if (
        typeof data.token !== "string" ||
        !/^\d{5,16}:[A-Za-z0-9_-]{25,100}$/.test(data.token)
      )
        return json({ error: "invalid_token" }, 400);
      settings.encryptedToken = sealToken(data.token);
    }
    if (data.removeToken === true) settings.encryptedToken = "";
    if (
      data.enabled &&
      (!settings.encryptedToken || !recipients.some((r) => r.enabled))
    )
      return json({ error: "missing_delivery_settings" }, 400);
    if (data.enabled && process.env.TELEGRAM_DELIVERY_ENABLED !== "true")
      return json({ error: "delivery_not_enabled" }, 400);
    settings.recipients = recipients;
    settings.enabled = data.enabled;
    settings.updatedAt = Date.now();
    await store.saveSettings(settings);
    return json({ ok: true, settings: publicSettings(settings) });
  } catch (error) {
    return apiError(error);
  }
}
