"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type {
  Summary,
  Lead,
  PublicSettings,
  Recipient,
} from "@/lib/admin/types";
type Data = {
  summary: Summary;
  leads: Lead[];
  settings: PublicSettings;
  mode: string;
  startedAt: number;
};
type Tab = "overview" | "leads" | "telegram";
const number = (n: number) => new Intl.NumberFormat("ru-RU").format(n);
const percent = (n: number) =>
  `${n.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%`;
const date = (n: number) =>
  new Date(n).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
const messages: Record<string, string> = {
  invalid_recipient: "Укажите имя и числовой Chat ID для каждого получателя.",
  duplicate_recipient: "Этот Chat ID добавлен несколько раз.",
  invalid_token: "Проверьте формат токена, выданного BotFather.",
  missing_delivery_settings:
    "Для отправки нужны ключ бота и хотя бы один активный получатель.",
  delivery_not_enabled: "Реальная отправка пока не включена на сервере.",
  encryption_not_configured: "Ключ шифрования не настроен на сервере.",
};
function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-empty">
      <span>↗</span>
      <p>{children}</p>
    </div>
  );
}

export function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview"),
    [days, setDays] = useState(30),
    [refresh, setRefresh] = useState(0),
    [data, setData] = useState<Data | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [query, setQuery] = useState(""),
    [logoutBusy, setLogoutBusy] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetch(`/api/admin/dashboard?days=${days}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (response.status === 401) {
          router.replace("/admin/login");
          return;
        }
        if (!response.ok) throw new Error();
        setData(await response.json());
      })
      .catch((error) => {
        if (error.name !== "AbortError")
          setError("Не удалось обновить данные. Повторите запрос.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [days, refresh, router]);
  async function logout() {
    setLogoutBusy(true);
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (response.ok || response.status === 401) {
        router.replace("/admin/login");
        router.refresh();
      } else setError("Не удалось завершить сессию. Попробуйте ещё раз.");
    } catch {
      setError("Не удалось завершить сессию.");
    } finally {
      setLogoutBusy(false);
    }
  }
  const saveSettings = useCallback(
    (settings: PublicSettings) =>
      setData((old) => (old ? { ...old, settings } : old)),
    [],
  );
  const titles = {
    overview: ["Обзор", "Как сайт превращает интерес в обращения."],
    leads: ["Заявки", "Все обращения и источники, которые их привели."],
    telegram: ["Telegram", "Уведомления для вашей команды."],
  };
  const s = data?.summary;
  const filtered =
    data?.leads.filter((l) =>
      `${l.name} ${l.email} ${l.company} ${l.attribution.source} ${l.attribution.campaign}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    ) || [];
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/" className="admin-brand">
          <Image src="/media/logo.svg" alt="FLYMAR" width={165} height={37} />
        </Link>
        <p className="admin-sidebar-label">УПРАВЛЕНИЕ САЙТОМ</p>
        <nav aria-label="Администрирование">
          {(
            [
              ["overview", "01", "Аналитика"],
              ["leads", "02", "Заявки"],
              ["telegram", "03", "Telegram"],
            ] as const
          ).map(([id, index, label]) => (
            <button
              key={id}
              aria-current={tab === id ? "page" : undefined}
              onClick={() => setTab(id)}
            >
              <span>{index}</span>
              {label}
              <span>↗</span>
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <Link href="/">Открыть сайт ↗</Link>
          <Link href="/ui-kit">UI Kit · оформление ↗</Link>
          <div className="admin-account">
            <span>A</span>
            <div>
              <strong>admin</strong>
              <small>Администратор</small>
            </div>
            <button
              onClick={logout}
              disabled={logoutBusy}
              aria-label="Выйти из админки"
            >
              Выйти
            </button>
          </div>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar">
          <span>
            FLYMAR <i>/</i> CONTROL CENTRE
          </span>
          <span className="admin-mode">
            <span />
            {data?.mode === "database" ? "Подключено" : "Предпросмотр"}
          </span>
        </header>
        <div className="admin-body">
          <div className="admin-page-heading">
            <div>
              <p className="admin-kicker">WEBSITE OPERATIONS</p>
              <h1>{titles[tab][0]}</h1>
              <p>{titles[tab][1]}</p>
            </div>
            {tab !== "telegram" && (
              <div className="admin-period">
                <label htmlFor="admin-period">Период</label>
                <select
                  id="admin-period"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                >
                  <option value={7}>7 дней</option>
                  <option value={30}>30 дней</option>
                  <option value={90}>90 дней</option>
                </select>
                <button
                  onClick={() => setRefresh((r) => r + 1)}
                  disabled={loading}
                >
                  ↻ Обновить
                </button>
              </div>
            )}
          </div>
          {data?.mode !== "database" && (
            <div className="admin-preview-note">
              <span>i</span>
              <div>
                <strong>База данных ещё не подключена</strong>
                <p>
                  Реальные события и тестовые заявки хранятся временно, до
                  перезапуска сервера. Пустые отчёты заполнятся после посещений
                  сайта.{data && <> Начало сбора: {date(data.startedAt)}.</>}
                </p>
              </div>
            </div>
          )}
          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}
          {loading && !data ? (
            <div className="admin-loading" role="status">
              Загружаем данные…
            </div>
          ) : (
            data &&
            s && (
              <>
                {tab === "overview" && (
                  <>
                    <div className="admin-metrics">
                      {[
                        [
                          "Просмотры страниц",
                          number(s.views),
                          "Все открытия страниц",
                        ],
                        [
                          "Сессии",
                          number(s.sessions),
                          "Визиты в рамках одной вкладки",
                        ],
                        ["Заявки", number(s.leads), "Приняты сервером"],
                        [
                          "Конверсия в заявку",
                          percent(s.conversion),
                          "Сессии с заявкой / все сессии",
                        ],
                      ].map(([label, value, note]) => (
                        <article key={label}>
                          <p>{label}</p>
                          <strong>{value}</strong>
                          <small>{note}</small>
                        </article>
                      ))}
                    </div>
                    <div className="admin-overview-grid">
                      <section className="admin-card">
                        <div className="admin-card-heading">
                          <h2>Посещаемость</h2>
                          <span>По дням · UTC</span>
                        </div>
                        {s.views ? (
                          <>
                            <div
                              className="admin-chart"
                              role="img"
                              aria-label={`Просмотры за ${days} дней: ${s.views}`}
                            >
                              {s.daily.map((d) => (
                                <div
                                  key={d.day}
                                  title={`${d.day}: ${d.views} просмотров, ${d.leads} заявок`}
                                >
                                  <span
                                    style={{
                                      height: `${d.views ? Math.max(4, (d.views / Math.max(...s.daily.map((x) => x.views))) * 100) : 0}%`,
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                            <div className="admin-chart-labels">
                              <span>{s.daily[0].day}</span>
                              <span>{s.daily.at(-1)?.day}</span>
                            </div>
                            <details className="admin-chart-details">
                              <summary>Данные по дням</summary>
                              <div className="admin-table-scroll">
                                <table>
                                  <thead>
                                    <tr>
                                      <th>Дата</th>
                                      <th>Просмотры</th>
                                      <th>Заявки</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {s.daily.map((d) => (
                                      <tr key={d.day}>
                                        <td>{d.day}</td>
                                        <td>{d.views}</td>
                                        <td>{d.leads}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </details>
                          </>
                        ) : (
                          <Empty>
                            Пока нет посещений. Откройте сайт — первый просмотр
                            появится здесь.
                          </Empty>
                        )}
                      </section>
                      <section className="admin-card">
                        <div className="admin-card-heading">
                          <h2>Путь к заявке</h2>
                        </div>
                        <div className="admin-funnel">
                          {[
                            ["Посещение", s.sessions],
                            ["Начали форму", s.starts],
                            [
                              "Сессии с заявкой",
                              Math.round((s.conversion * s.sessions) / 100),
                            ],
                          ].map(([label, value], i) => (
                            <div key={label}>
                              <span>0{i + 1}</span>
                              <div>
                                <p>{label}</p>
                                <div className="admin-meter">
                                  <span
                                    style={{
                                      width: `${s.sessions ? Math.min(100, (Number(value) / s.sessions) * 100) : 0}%`,
                                    }}
                                  />
                                </div>
                              </div>
                              <strong>{value}</strong>
                            </div>
                          ))}
                        </div>
                        <p className="admin-footnote">
                          Сессия обновляется после 30 минут бездействия.
                          Повторные заявки одной сессии не увеличивают
                          конверсию.
                        </p>
                      </section>
                    </div>
                    <section className="admin-card">
                      <div className="admin-card-heading">
                        <h2>Источники и UTM</h2>
                        <span>Первая метка сессии</span>
                      </div>
                      {s.sources.length ? (
                        <div className="admin-table-scroll">
                          <table>
                            <thead>
                              <tr>
                                <th>Источник / канал</th>
                                <th>Кампания</th>
                                <th>Контент / запрос</th>
                                <th>Сессии</th>
                                <th>Заявки</th>
                                <th>Конверсия</th>
                              </tr>
                            </thead>
                            <tbody>
                              {s.sources.map((r, i) => (
                                <tr key={i}>
                                  <td>
                                    <strong>{r.source}</strong>
                                    <small>{r.medium || "—"}</small>
                                  </td>
                                  <td>{r.campaign || "—"}</td>
                                  <td>
                                    {r.content || "—"}
                                    <small>{r.term || "—"}</small>
                                  </td>
                                  <td>{r.sessions}</td>
                                  <td>{r.leads}</td>
                                  <td>{percent(r.conversion)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <Empty>
                          Источники появятся вместе с первыми визитами.
                          Поддерживаются source, medium, campaign, content и
                          term.
                        </Empty>
                      )}
                    </section>
                    <section className="admin-card">
                      <div className="admin-card-heading">
                        <h2>Популярные страницы</h2>
                      </div>
                      {s.pages.length ? (
                        <div className="admin-page-list">
                          {s.pages.map((p) => (
                            <div key={p.path}>
                              <span>{p.path}</span>
                              <strong>{p.views}</strong>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Empty>Страницы пока не просматривали.</Empty>
                      )}
                    </section>
                  </>
                )}
                {tab === "leads" && (
                  <section className="admin-card">
                    <div className="admin-card-heading">
                      <h2>
                        Обращения{" "}
                        <span className="admin-count">{data.leads.length}</span>
                      </h2>
                      <label className="admin-search">
                        Поиск
                        <input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Имя, email, компания или UTM"
                        />
                      </label>
                    </div>
                    {filtered.length ? (
                      <div className="admin-leads">
                        {filtered.map((l) => (
                          <details key={l.id}>
                            <summary>
                              <span>
                                <strong>{l.name}</strong>
                                <small>{l.email}</small>
                              </span>
                              <span>
                                {l.company || "Частное обращение"}
                                <small>
                                  {l.attribution.source || "Без UTM"} /{" "}
                                  {l.attribution.campaign || "—"}
                                </small>
                              </span>
                              <span>
                                <time>{date(l.at)}</time>
                                <small>
                                  {l.status === "preview"
                                    ? "Тестовая заявка"
                                    : "Получена"}{" "}
                                  · +
                                </small>
                              </span>
                            </summary>
                            <div className="admin-lead-detail">
                              <p>{l.message || "Сообщение не указано."}</p>
                              <dl>
                                <div>
                                  <dt>Страница входа</dt>
                                  <dd>{l.attribution.landing}</dd>
                                </div>
                                <div>
                                  <dt>UTM source / medium</dt>
                                  <dd>
                                    {l.attribution.source || "—"} /{" "}
                                    {l.attribution.medium || "—"}
                                  </dd>
                                </div>
                                <div>
                                  <dt>UTM campaign / content / term</dt>
                                  <dd>
                                    {l.attribution.campaign || "—"} /{" "}
                                    {l.attribution.content || "—"} /{" "}
                                    {l.attribution.term || "—"}
                                  </dd>
                                </div>
                                <div>
                                  <dt>Telegram</dt>
                                  <dd>
                                    {
                                      {
                                        disabled: "Не отправлялось",
                                        sent: "Доставлено всем",
                                        partial: "Доставлено части получателей",
                                        failed: "Ошибка доставки",
                                      }[l.telegram]
                                    }
                                  </dd>
                                </div>
                                {l.webhook && l.webhook !== "disabled" && (
                                  <div>
                                    <dt>Внешний обработчик</dt>
                                    <dd>
                                      {l.webhook === "sent"
                                        ? "Доставлено"
                                        : "Ошибка доставки — заявка сохранена здесь"}
                                    </dd>
                                  </div>
                                )}
                              </dl>
                            </div>
                          </details>
                        ))}
                      </div>
                    ) : (
                      <Empty>
                        {query
                          ? "По вашему запросу ничего не найдено."
                          : "Заявок пока нет. Отправьте тестовую форму с сайта, чтобы проверить весь путь."}
                      </Empty>
                    )}
                    <p className="admin-footnote">
                      Показаны до 200 последних заявок выбранного периода.
                      Данные формы доступны только администратору.
                    </p>
                  </section>
                )}
                {tab === "telegram" && (
                  <TelegramEditor
                    settings={data.settings}
                    onSave={saveSettings}
                  />
                )}
              </>
            )
          )}
          <footer className="admin-footer">
            FLYMAR / CONTROL CENTRE
            <span>Посещения · Заявки · Telegram</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

function TelegramEditor({
  settings,
  onSave,
}: {
  settings: PublicSettings;
  onSave: (settings: PublicSettings) => void;
}) {
  const router = useRouter();
  const [recipients, setRecipients] = useState<Recipient[]>(
      settings.recipients,
    ),
    [token, setToken] = useState(""),
    [revealed, setRevealed] = useState(""),
    [show, setShow] = useState(false),
    [enabled, setEnabled] = useState(settings.enabled),
    [removeToken, setRemoveToken] = useState(false),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [error, setError] = useState("");
  useEffect(() => {
    if (!show) return;
    const timeout = setTimeout(() => {
      setShow(false);
      setRevealed("");
    }, 30000);
    return () => clearTimeout(timeout);
  }, [show]);
  async function toggleSecret() {
    if (show) {
      setShow(false);
      setRevealed("");
      return;
    }
    if (token) {
      setShow(true);
      return;
    }
    if (!settings.hasToken || removeToken) return;
    setError("");
    try {
      const response = await fetch("/api/admin/telegram/reveal", {
        method: "POST",
      });
      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!response.ok) throw new Error();
      const result = await response.json();
      setRevealed(result.token);
      setShow(true);
    } catch {
      setError("Не удалось показать ключ. Повторите попытку.");
    }
  }
  function updateRecipient(index: number, patch: Partial<Recipient>) {
    setRecipients((old) =>
      old.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    );
    setNotice("");
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    setShow(false);
    setRevealed("");
    try {
      const response = await fetch("/api/admin/telegram", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, removeToken, enabled, recipients }),
      });
      const result = await response.json();
      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!response.ok) {
        setError(messages[result.error] || "Не удалось сохранить настройки.");
        return;
      }
      onSave(result.settings);
      setRecipients(result.settings.recipients);
      setToken("");
      setRemoveToken(false);
      setNotice("Настройки сохранены.");
    } catch {
      setError("Сервер недоступен. Изменения не сохранены.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={save} className="admin-telegram">
      <section className="admin-card">
        <div className="admin-card-heading">
          <div>
            <h2>Бот уведомлений</h2>
            <p>Новые заявки — прямо вашей команде.</p>
          </div>
          <span className="admin-pill">
            {settings.hasToken ? "Ключ сохранён" : "Не подключён"}
          </span>
        </div>
        <label htmlFor="bot-token">API-ключ бота</label>
        <div className="admin-password">
          <input
            id="bot-token"
            type={show ? "text" : "password"}
            value={token || revealed}
            onChange={(e) => {
              setToken(e.target.value);
              setRevealed("");
              setRemoveToken(false);
              setNotice("");
            }}
            autoComplete="off"
            spellCheck={false}
            placeholder={
              settings.hasToken && !removeToken
                ? "•••••••••••••••• · введите для замены"
                : "Токен от BotFather"
            }
            maxLength={130}
          />
          <button
            type="button"
            onClick={toggleSecret}
            aria-pressed={show}
            disabled={!token && (!settings.hasToken || removeToken)}
          >
            {show ? "Скрыть" : "Показать"}
          </button>
        </div>
        <p className="admin-footnote">
          Пустое поле сохраняет текущий ключ. Показанный ключ скрывается через
          30 секунд. В хранилище он зашифрован.
        </p>
        {settings.hasToken && (
          <label className="admin-check">
            <input
              type="checkbox"
              checked={removeToken}
              onChange={(e) => {
                setRemoveToken(e.target.checked);
                setToken("");
                setRevealed("");
                setShow(false);
                if (e.target.checked) setEnabled(false);
              }}
            />
            Удалить сохранённый ключ при сохранении
          </label>
        )}
      </section>
      <section className="admin-card">
        <div className="admin-card-heading">
          <div>
            <h2>Получатели</h2>
            <p>Один или несколько администраторов.</p>
          </div>
          <button
            className="admin-secondary"
            type="button"
            disabled={recipients.length >= 10}
            onClick={() =>
              setRecipients((old) => [
                ...old,
                {
                  id: crypto.randomUUID(),
                  name: "",
                  chatId: "",
                  enabled: true,
                },
              ])
            }
          >
            + Добавить
          </button>
        </div>
        <p className="admin-footnote">
          Для личного аккаунта нужен числовой Chat ID, а не @username.
          Получатель должен сначала написать боту /start. Можно добавить и Chat
          ID группы, в которой состоит бот.
        </p>
        {recipients.length ? (
          <div className="admin-recipients">
            {recipients.map((r, i) => (
              <div key={r.id}>
                <label>
                  Имя или @username
                  <input
                    value={r.name}
                    onChange={(e) =>
                      updateRecipient(i, { name: e.target.value })
                    }
                    required
                    maxLength={80}
                    placeholder="Администратор"
                  />
                </label>
                <label>
                  Chat ID
                  <input
                    value={r.chatId}
                    onChange={(e) =>
                      updateRecipient(i, { chatId: e.target.value.trim() })
                    }
                    required
                    pattern="-?[1-9][0-9]{3,19}"
                    maxLength={21}
                    placeholder="123456789"
                  />
                </label>
                <label className="admin-check">
                  <input
                    type="checkbox"
                    checked={r.enabled}
                    onChange={(e) =>
                      updateRecipient(i, { enabled: e.target.checked })
                    }
                  />
                  Активен
                </label>
                <button
                  type="button"
                  className="admin-remove"
                  onClick={() =>
                    setRecipients((old) => old.filter((_, n) => n !== i))
                  }
                  aria-label={`Удалить получателя ${i + 1}`}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        ) : (
          <Empty>Добавьте первого получателя уведомлений.</Empty>
        )}
      </section>
      <section className="admin-card">
        <h2>Отправка уведомлений</h2>
        <label className="admin-check">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            disabled={!settings.deliveryAvailable}
          />
          Отправлять новые заявки в Telegram
        </label>
        <p className="admin-footnote">
          {settings.deliveryAvailable
            ? "После включения новые заявки будут отправляться активным получателям."
            : "Подключение подготовлено. Реальная отправка выключена на сервере до настройки бота и запуска сайта."}
        </p>
      </section>
      {error && (
        <p role="alert" className="admin-error">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="admin-success">
          {notice}
        </p>
      )}
      <div className="admin-save-row">
        <span>До 10 получателей · ключ доступен только администратору</span>
        <button className="admin-primary" disabled={busy}>
          {busy ? "Сохраняем…" : "Сохранить настройки"}
          <span>↗</span>
        </button>
      </div>
    </form>
  );
}
