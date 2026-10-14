import "server-only";
import { openToken } from "./security";
import type { TelegramSettings, PublicSettings, Lead } from "./types";
export function publicSettings(settings: TelegramSettings): PublicSettings {
  return {
    hasToken: !!settings.encryptedToken,
    recipients: settings.recipients,
    enabled: settings.enabled,
    updatedAt: settings.updatedAt,
    deliveryAvailable: process.env.TELEGRAM_DELIVERY_ENABLED === "true",
  };
}
export async function notifyTelegram(
  lead: Lead,
  settings: TelegramSettings,
): Promise<Lead["telegram"]> {
  if (
    process.env.TELEGRAM_DELIVERY_ENABLED !== "true" ||
    !settings.enabled ||
    !settings.encryptedToken
  )
    return "disabled";
  const recipients = settings.recipients.filter((r) => r.enabled);
  if (!recipients.length) return "disabled";
  const token = openToken(settings.encryptedToken);
  const text = [
    "FLYMAR · Новая заявка",
    `Имя: ${lead.name}`,
    `Email: ${lead.email}`,
    `Компания: ${lead.company || "—"}`,
    `Сообщение: ${lead.message || "—"}`,
    `Источник: ${lead.attribution.source || "Прямой"}`,
    `Кампания: ${lead.attribution.campaign || "—"}`,
    `Страница: ${lead.attribution.landing}`,
    `ID: ${lead.id}`,
  ]
    .join("\n")
    .slice(0, 4000);
  const results = await Promise.all(
    recipients.map(async (recipient) => {
      try {
        const response = await fetch(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: recipient.chatId, text }),
            signal: AbortSignal.timeout(8000),
            cache: "no-store",
          },
        );
        const result = await response.json();
        return response.ok && result.ok === true;
      } catch {
        return false;
      } // Never log a URL containing the token or message contents.
    }),
  );
  return results.every(Boolean)
    ? "sent"
    : results.some(Boolean)
      ? "partial"
      : "failed";
}
