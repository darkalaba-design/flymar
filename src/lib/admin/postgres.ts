import "server-only";
import { Pool } from "pg";
import type { AdminRepository } from "./repository";
import type { VisitEvent, Lead, TelegramSettings, Session } from "./types";

/** All values are parameters. Unique keys make event/lead ingestion idempotent. */
export class PostgresRepository implements AdminRepository {
  readonly mode = "database" as const;
  readonly startedAt = Date.now();
  private pool: Pool;
  constructor(connectionString: string) {
    this.pool = new Pool({
      connectionString,
      max: 5,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      statement_timeout: 10000,
    });
    this.pool.on("error", () =>
      console.error("FLYMAR: database connection unavailable"),
    );
  }
  async addEvent(event: VisitEvent) {
    await this.pool.query(
      "INSERT INTO flymar_events (id, at, data) VALUES ($1,$2,$3) ON CONFLICT (id) DO NOTHING",
      [event.id, event.at, event],
    );
  }
  async eventsSince(since: number): Promise<VisitEvent[]> {
    const result = await this.pool.query(
      "SELECT data FROM flymar_events WHERE at >= $1 ORDER BY at",
      [since],
    );
    return result.rows.map((r) => r.data);
  }
  async addLead(lead: Lead) {
    const result = await this.pool.query(
      "INSERT INTO flymar_leads (id, at, data) VALUES ($1,$2,$3) ON CONFLICT (id) DO NOTHING",
      [lead.id, lead.at, lead],
    );
    return result.rowCount === 1;
  }
  async updateLead(id: string, patch: Pick<Lead, "telegram" | "webhook">) {
    await this.pool.query(
      "UPDATE flymar_leads SET data = data || $2::jsonb WHERE id = $1",
      [id, patch],
    );
  }
  async leadsSince(since: number): Promise<Lead[]> {
    const result = await this.pool.query(
      "SELECT data FROM flymar_leads WHERE at >= $1 ORDER BY at DESC",
      [since],
    );
    return result.rows.map((r) => r.data);
  }
  async getSettings(): Promise<TelegramSettings> {
    const result = await this.pool.query(
      "SELECT data FROM flymar_settings WHERE id = 'telegram'",
    );
    return (
      result.rows[0]?.data ?? {
        encryptedToken: "",
        recipients: [],
        enabled: false,
        updatedAt: 0,
      }
    );
  }
  async saveSettings(settings: TelegramSettings) {
    await this.pool.query(
      "INSERT INTO flymar_settings (id,data) VALUES ('telegram',$1) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data",
      [settings],
    );
  }
  async getSession(hash: string): Promise<Session | null> {
    const result = await this.pool.query(
      "SELECT data FROM flymar_sessions WHERE hash = $1 AND expires > $2",
      [hash, Date.now()],
    );
    return result.rows[0]?.data ?? null;
  }
  async saveSession(hash: string, session: Session) {
    await this.pool.query("DELETE FROM flymar_sessions WHERE expires <= $1", [
      Date.now(),
    ]);
    await this.pool.query(
      "INSERT INTO flymar_sessions (hash,expires,data) VALUES ($1,$2,$3)",
      [hash, session.expires, session],
    );
  }
  async deleteSession(hash: string) {
    await this.pool.query("DELETE FROM flymar_sessions WHERE hash = $1", [
      hash,
    ]);
  }
  async consumeRate(key: string, limit: number, windowMs: number) {
    // One atomic UPSERT serializes concurrent requests, including across server instances.
    const now = Date.now();
    const result = await this.pool.query(
      `INSERT INTO flymar_rates (key,count,until) VALUES ($1,1,$3)
       ON CONFLICT (key) DO UPDATE SET
         count = CASE WHEN flymar_rates.until <= $2 THEN 1 ELSE LEAST(flymar_rates.count + 1, 1000000) END,
         until = CASE WHEN flymar_rates.until <= $2 THEN $3 ELSE flymar_rates.until END
       RETURNING count, until`,
      [key, now, now + windowMs],
    );
    const bucket = result.rows[0];
    return {
      allowed: bucket.count <= limit,
      retryAfter: Math.max(1, Math.ceil((Number(bucket.until) - now) / 1000)),
    };
  }
}
