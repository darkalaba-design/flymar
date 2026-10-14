import "server-only";
import { PostgresRepository } from "./postgres";
import type {
  VisitEvent,
  Lead,
  TelegramSettings,
  Session,
  RateResult,
} from "./types";

/** Implement these atomic operations in the production DB/Redis adapter. */
export interface AdminRepository {
  readonly mode: "preview" | "database";
  readonly startedAt: number;
  addEvent(event: VisitEvent): Promise<void>;
  eventsSince(since: number): Promise<VisitEvent[]>;
  addLead(lead: Lead): Promise<boolean>;
  updateLead(
    id: string,
    patch: Pick<Lead, "telegram" | "webhook">,
  ): Promise<void>;
  leadsSince(since: number): Promise<Lead[]>;
  getSettings(): Promise<TelegramSettings>;
  saveSettings(settings: TelegramSettings): Promise<void>;
  getSession(hash: string): Promise<Session | null>;
  saveSession(hash: string, session: Session): Promise<void>;
  deleteSession(hash: string): Promise<void>;
  consumeRate(
    key: string,
    limit: number,
    windowMs: number,
  ): Promise<RateResult>;
}

export class MemoryRepository implements AdminRepository {
  readonly mode = "preview" as const;
  readonly startedAt = Date.now();
  private events = new Map<string, VisitEvent>();
  private leads = new Map<string, Lead>();
  private sessions = new Map<string, Session>();
  private rates = new Map<string, { count: number; until: number }>();
  private settings: TelegramSettings = {
    encryptedToken: "",
    recipients: [],
    enabled: false,
    updatedAt: 0,
  };
  async addEvent(event: VisitEvent) {
    if (this.events.has(event.id)) return;
    if (this.events.size >= 20000)
      this.events.delete(this.events.keys().next().value!);
    this.events.set(event.id, structuredClone(event));
  }
  async eventsSince(since: number) {
    return structuredClone(
      [...this.events.values()].filter((e) => e.at >= since),
    );
  }
  async addLead(lead: Lead) {
    if (this.leads.has(lead.id)) return false;
    // Fail instead of silently discarding enquiries if the preview store fills up.
    if (this.leads.size >= 2000) throw new Error("preview_capacity");
    this.leads.set(lead.id, structuredClone(lead));
    return true;
  }
  async updateLead(id: string, patch: Pick<Lead, "telegram" | "webhook">) {
    const lead = this.leads.get(id);
    if (lead) Object.assign(lead, patch);
  }
  async leadsSince(since: number) {
    return structuredClone(
      [...this.leads.values()]
        .filter((e) => e.at >= since)
        .sort((a, b) => b.at - a.at),
    );
  }
  async getSettings() {
    return structuredClone(this.settings);
  }
  async saveSettings(settings: TelegramSettings) {
    this.settings = structuredClone(settings);
  }
  async getSession(hash: string) {
    const session = this.sessions.get(hash);
    if (!session || session.expires <= Date.now()) {
      this.sessions.delete(hash);
      return null;
    }
    return { ...session };
  }
  async saveSession(hash: string, session: Session) {
    for (const [id, value] of this.sessions)
      if (value.expires <= Date.now()) this.sessions.delete(id);
    if (this.sessions.size >= 100)
      this.sessions.delete(this.sessions.keys().next().value!);
    this.sessions.set(hash, { ...session });
  }
  async deleteSession(hash: string) {
    this.sessions.delete(hash);
  }
  async consumeRate(key: string, limit: number, windowMs: number) {
    const now = Date.now();
    for (const [id, value] of this.rates)
      if (value.until <= now) this.rates.delete(id);
    const bucket = this.rates.get(key) ?? { count: 0, until: now + windowMs };
    if (!this.rates.has(key) && this.rates.size >= 10000)
      return { allowed: false, retryAfter: 60 };
    bucket.count++;
    this.rates.set(key, bucket);
    return {
      allowed: bucket.count <= limit,
      retryAfter: Math.max(1, Math.ceil((bucket.until - now) / 1000)),
    };
  }
}

// Production must never accept data in RAM. PostgreSQL is selected by DATABASE_URL.
const runtime = globalThis as typeof globalThis & {
  flymarAdminRepository?: AdminRepository;
};
export function getRepository(): AdminRepository {
  if (process.env.DATABASE_URL) {
    if (runtime.flymarAdminRepository?.mode !== "database")
      runtime.flymarAdminRepository = new PostgresRepository(
        process.env.DATABASE_URL,
      );
    return runtime.flymarAdminRepository;
  }
  if (process.env.NODE_ENV === "production")
    throw new Error("database_not_connected");
  return (runtime.flymarAdminRepository ??= new MemoryRepository());
}
