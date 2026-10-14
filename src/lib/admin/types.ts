export const eventNames = [
  "page_view",
  "section_view",
  "cta_click",
  "modal_open",
  "form_start",
  "form_submit",
  "form_success",
  "form_error",
  "hero_change",
] as const;
export type EventName = (typeof eventNames)[number];
export type Attribution = {
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
  landing: string;
};
export type VisitEvent = {
  id: string;
  sessionId: string;
  event: EventName;
  path: string;
  at: number;
  attribution: Attribution;
};
export type Lead = {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  locale: string;
  at: number;
  sessionId: string;
  attribution: Attribution;
  status: "preview" | "received";
  telegram: "disabled" | "sent" | "partial" | "failed";
  webhook: "disabled" | "sent" | "failed";
};
export type Recipient = {
  id: string;
  name: string;
  chatId: string;
  enabled: boolean;
};
export type TelegramSettings = {
  encryptedToken: string;
  recipients: Recipient[];
  enabled: boolean;
  updatedAt: number;
};
export type PublicSettings = {
  hasToken: boolean;
  recipients: Recipient[];
  enabled: boolean;
  updatedAt: number;
  deliveryAvailable: boolean;
};
export type Session = {
  expires: number;
  createdAt: number;
  credentialVersion: string;
};
export type RateResult = { allowed: boolean; retryAfter: number };
export type Summary = {
  days: number;
  views: number;
  sessions: number;
  starts: number;
  submissions: number;
  leads: number;
  conversion: number;
  daily: { day: string; views: number; leads: number }[];
  sources: {
    source: string;
    medium: string;
    campaign: string;
    term: string;
    content: string;
    sessions: number;
    leads: number;
    conversion: number;
  }[];
  pages: { path: string; views: number }[];
};
