"use client";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Arrow } from "../visual";
import { BenefitIcon } from "../business-benefits";
import { DRAFT_KEY, setThemeDraft } from "../theme-provider";
import {
  contrast,
  fields,
  fonts,
  presets,
  themeCss,
  themeVariables,
  tokenName,
  validateTheme,
  type Theme,
  type ThemeKey,
} from "@/lib/design/theme";
import type { ThemeSnapshot } from "@/lib/design/store";
import catalog from "@/lib/design/catalog.json";
import s from "./ui-kit.module.css";

const tabs = ["Foundations", "Компоненты", "Иконки"] as const;
const fontLabels = {
  sans: "Arial · нейтральный",
  humanist: "Trebuchet · человечный",
  editorial: "Georgia · редакционный",
  technical: "Courier · технический",
};

export function UiKit({
  snapshot,
  authenticated,
}: {
  snapshot: ThemeSnapshot;
  authenticated: boolean;
}) {
  const [saved, setSaved] = useState(snapshot);
  const [theme, setTheme] = useState<Theme>(snapshot.theme);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Foundations");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const [preview, setPreview] = useState(true);
  const [ready, setReady] = useState(false);
  const [history, setHistory] = useState<Theme[]>([]);
  const importRef = useRef<HTMLInputElement>(null);
  const dirty = JSON.stringify(theme) !== JSON.stringify(saved.theme);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) setTheme(validateTheme(JSON.parse(raw)));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) setThemeDraft(preview && dirty ? theme : null);
  }, [theme, preview, dirty, ready]);
  useEffect(() => {
    if (modal) dialog.current?.showModal();
    else dialog.current?.close();
  }, [modal]);
  function change(next: Theme) {
    setHistory((h) => [...h.slice(-29), theme]);
    setTheme(next);
    setStatus("");
  }
  function update(key: ThemeKey, value: string | number) {
    change(validateTheme({ ...theme, [key]: value }));
  }
  async function save() {
    setBusy(true);
    setStatus("");
    try {
      const r = await fetch("/api/admin/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, revision: saved.revision }),
      });
      const data = await r.json();
      if (r.status === 401) {
        setStatus(
          "Сессия завершилась. Войдите в админку и вернитесь в UI Kit. Черновик сохранён в этой вкладке.",
        );
        return;
      }
      if (r.status === 409) {
        setStatus(
          "Оформление уже изменено в другой вкладке. Обновите страницу, чтобы загрузить сохранённую версию; ваш черновик останется для сравнения.",
        );
        return;
      }
      if (!r.ok)
        throw new Error(
          r.status === 403
            ? "Адрес сайта не совпадает с настройкой сервера."
            : "Сохранение недоступно. Проверьте подключение базы и настройки сервера.",
        );
      setSaved(data);
      setHistory([]);
      setThemeDraft(null);
      setStatus(
        data.storage === "file"
          ? "Сохранено для всего локального сайта. Файл темы можно отправить на GitHub вместе с проектом."
          : "Опубликовано для всех посетителей. Открытые страницы обновят оформление в течение 30 секунд.",
      );
      window.dispatchEvent(new Event("focus"));
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Не удалось сохранить.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setStatus(
        `Скопировано: ${value.startsWith("--") ? value : "CSS-переменные"}`,
      );
    } catch {
      setStatus("Буфер обмена недоступен. Используйте экспорт JSON.");
    }
  }
  function exportTheme() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify({ version: 1, theme }, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "flymar-theme.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const ratio = contrast(theme.ink, theme.paper);
  const matches = (text: string) =>
    text.toLowerCase().includes(query.toLowerCase());
  return (
    <div
      className={s.shell}
      data-flymar-theme
      style={themeVariables(theme) as CSSProperties}
    >
      <aside className={s.sidebar}>
        <a className={s.brand} href="/">
          FLYMAR <span>DESIGN SYSTEM / 01</span>
        </a>
        <p className={s.navLabel}>Библиотека</p>
        <nav aria-label="Разделы UI Kit">
          {tabs.map((name, i) => (
            <button
              key={name}
              onClick={() => setTab(name)}
              aria-current={tab === name ? "page" : undefined}
            >
              <span>0{i + 1}</span>
              {name}
              <span>↗</span>
            </button>
          ))}
        </nav>
        <div className={s.sideNote}>
          <span className={s.dot} /> Единая система
          <br />
          <p>Переменные → компоненты → весь сайт.</p>
        </div>
        <a className={s.back} href="/admin">
          Администрирование ↗
        </a>
      </aside>
      <main className={s.main}>
        <header className={s.toolbar}>
          <label className={s.search}>
            ⌕{" "}
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Найти цвет, компонент, переменную…"
              aria-label="Поиск по UI Kit"
            />
          </label>
          <a href="/">Открыть сайт ↗</a>
        </header>
        <div className={s.intro}>
          <span>FLYMAR / VISUAL LANGUAGE</span>
          <h1>
            Make it feel
            <br />
            <em>like FLYMAR.</em>
          </h1>
          <p>
            Один набор переменных. Все страницы, оба языка.
            <br />
            Настраивайте характер сайта и смотрите результат вживую.
          </p>
        </div>
        <div className={s.state}>
          <span className={s.dot} />
          {dirty ? "Есть неопубликованные изменения" : "Сохранённое оформление"}
          <span>
            {saved.storage === "file"
              ? "Локальный проект"
              : saved.storage === "database"
                ? "Общая база данных"
                : "Режим предпросмотра"}
          </span>
        </div>
        {status && (
          <p role="status" className={s.notice}>
            {status}
          </p>
        )}
        <div className={s.workspace}>
          <div
            className={s.library}
            data-flymar-theme
            style={themeVariables(theme) as CSSProperties}
          >
            {tab === "Foundations" && (
              <>
                <section className={s.panel}>
                  <div className={s.sectionTitle}>
                    <span>01 / FOUNDATIONS</span>
                    <h2>Характер сайта</h2>
                    <p>
                      Пресеты — отправная точка. Они не публикуются без
                      сохранения.
                    </p>
                  </div>
                  <div className={s.presets}>
                    {Object.entries(presets).map(([id, p]) => (
                      <button key={id} onClick={() => change({ ...p.theme })}>
                        <div>
                          {[
                            p.theme.ink,
                            p.theme.paper,
                            p.theme.muted,
                            p.theme.accent,
                          ].map((color, i) => (
                            <i key={i} style={{ background: color }} />
                          ))}
                        </div>
                        <strong>{p.label}</strong>
                        <span>{p.description}</span>
                      </button>
                    ))}
                  </div>
                </section>
                <section className={s.panel}>
                  <div className={s.sectionTitle}>
                    <span>COLOR</span>
                    <h2>Палитра и поверхности</h2>
                    <p>
                      Производные оттенки, градиенты и иконки следуют основным
                      цветам.
                    </p>
                  </div>
                  <div className={s.swatches}>
                    {fields
                      .filter(
                        (f) =>
                          f.type === "color" &&
                          matches(f.label + " " + tokenName(f.key)),
                      )
                      .map((f) => (
                        <button
                          key={f.key}
                          onClick={() => copy(tokenName(f.key))}
                        >
                          <i style={{ background: theme[f.key] as string }} />
                          <strong>{f.label}</strong>
                          <code>{tokenName(f.key)}</code>
                          <small>{String(theme[f.key])}</small>
                        </button>
                      ))}
                  </div>
                  <p className={s.contrast}>
                    Контраст основного текста и фона:{" "}
                    <strong>{ratio.toFixed(2)}:1</strong> ·{" "}
                    {ratio >= 4.5
                      ? "достаточен для обычного текста"
                      : "низкий — рекомендуем увеличить контраст"}
                  </p>
                </section>
                <section className={s.panel}>
                  <div className={s.sectionTitle}>
                    <span>TYPOGRAPHY</span>
                    <h2>Типографика</h2>
                    <p>
                      Адаптивные размеры сохраняют пропорции на телефонах и
                      ноутбуках.
                    </p>
                  </div>
                  <div className={s.typeSamples}>
                    <h2>Above the water.</h2>
                    <h3>One vessel. Endless missions.</h3>
                    <p>
                      Электричество. Интеллект. Свобода.
                      <br />
                      Built for every day on the water.
                    </p>
                    <span className="micro-label">
                      FLYMAR / INTELLIGENCE IN MOTION
                    </span>
                  </div>
                  <details className={s.details}>
                    <summary>
                      Шкала размеров · {catalog.type.length} переменных
                    </summary>
                    {catalog.type
                      .filter((t) => matches(t.name + " " + t.value))
                      .map((t) => (
                        <button key={t.name} onClick={() => copy(t.name)}>
                          <code>{t.name}</code>
                          <span>{t.value}</span>
                        </button>
                      ))}
                  </details>
                </section>
                <section className={s.panel}>
                  <div className={s.sectionTitle}>
                    <span>SPACING / RADIUS / ELEVATION</span>
                    <h2>Ритм и геометрия</h2>
                  </div>
                  <div className={s.spacing}>
                    {[4, 8, 16, 24, 40, 64].map((n) => (
                      <div key={n}>
                        <code>--fm-space-{n}</code>
                        <i style={{ width: `var(--fm-space-${n})` }} />
                        <span>{Math.round(n * theme.density)} px</span>
                      </div>
                    ))}
                  </div>
                  <div className={s.geometry}>
                    <div style={{ borderRadius: "var(--fm-radius)" }}>
                      Controls
                      <br />
                      <code>{theme.radius}px</code>
                    </div>
                    <div style={{ borderRadius: "var(--fm-card-radius)" }}>
                      Cards
                      <br />
                      <code>{theme.cardRadius}px</code>
                    </div>
                    <div
                      style={{
                        boxShadow:
                          "0 12px 32px rgb(from var(--fm-ink) r g b / calc(.18 * var(--fm-shadow)))",
                      }}
                    >
                      Elevation
                      <br />
                      <code>{theme.shadow}×</code>
                    </div>
                  </div>
                </section>
              </>
            )}
            {tab === "Компоненты" && (
              <>
                {matches("кнопки buttons links") && (
                  <section className={s.panel}>
                    <div className={s.sectionTitle}>
                      <span>ATOMS / ACTIONS</span>
                      <h2>Кнопки и ссылки</h2>
                      <p>
                        Те же классы и переменные, что используются на страницах
                        FLYMAR.
                      </p>
                    </div>
                    <div className={s.buttonSamples}>
                      <button
                        className="button button-dark"
                        onClick={() => setModal(true)}
                      >
                        Get in touch
                        <Arrow diagonal />
                      </button>
                      <button
                        className="button button-light"
                        onClick={() =>
                          setStatus(
                            "Кнопка работает. Это демонстрационный образец.",
                          )
                        }
                      >
                        Explore the model
                        <Arrow diagonal />
                      </button>
                      <button className="button button-dark" disabled>
                        Disabled
                        <Arrow diagonal />
                      </button>
                      <button
                        className="text-link"
                        onClick={() => setModal(true)}
                      >
                        Learn more
                        <Arrow diagonal />
                      </button>
                      <button
                        className="circle-button"
                        aria-label="Пример стрелки"
                        onClick={() => setStatus("Стрелка нажата.")}
                      >
                        <Arrow />
                      </button>
                    </div>
                  </section>
                )}
                {matches("формы inputs fields заявка") && (
                  <section className={s.panel}>
                    <div className={s.sectionTitle}>
                      <span>ATOMS / INPUTS</span>
                      <h2>Форма обращения</h2>
                    </div>
                    <form
                      className={s.sampleForm}
                      onSubmit={(e) => {
                        e.preventDefault();
                        setStatus(
                          "Демонстрационная форма проверена. Заявка не отправлялась.",
                        );
                      }}
                    >
                      <div className="form-row">
                        <label>
                          Your name
                          <input required placeholder="Alex Morgan" />
                        </label>
                        <label>
                          Email
                          <input
                            type="email"
                            required
                            placeholder="alex@company.com"
                          />
                        </label>
                      </div>
                      <label>
                        Your plans
                        <textarea
                          rows={3}
                          placeholder="Tell us about your route…"
                        />
                      </label>
                      <label className="consent">
                        <input type="checkbox" required /> I agree to the
                        processing of my details.
                      </label>
                      <button className="button button-dark">
                        Send enquiry
                        <Arrow diagonal />
                      </button>
                    </form>
                  </section>
                )}
                {matches("карточки cards fleet") && (
                  <section className={s.panel}>
                    <div className={s.sectionTitle}>
                      <span>MOLECULES / CARDS</span>
                      <h2>Карточки и статусы</h2>
                    </div>
                    <div className={s.cardSample}>
                      <Image
                        src="/media/leisure.webp"
                        width={900}
                        height={560}
                        alt="FLYMAR F8 на воде"
                      />
                      <div>
                        <span className="micro-label">FLYMAR F8</span>
                        <h3>
                          One vessel.
                          <br />
                          Endless missions.
                        </h3>
                        <p>The Everyday Electric Hydrofoil.</p>
                        <button
                          className="button button-dark"
                          onClick={() => setModal(true)}
                        >
                          Get in touch
                          <Arrow diagonal />
                        </button>
                      </div>
                    </div>
                    <p className="product-launch-status">
                      <span /> Coming Soon
                    </p>
                  </section>
                )}
              </>
            )}
            {tab === "Иконки" && (
              <section className={s.panel}>
                <div className={s.sectionTitle}>
                  <span>ASSETS / ICONOGRAPHY</span>
                  <h2>Иконки FLYMAR</h2>
                  <p>
                    Оригинальные A1–A3 и B1–B3. Цвет наследуется от основного
                    цвета сайта.
                  </p>
                </div>
                <div className={s.icons}>
                  {(
                    [
                      "monitor",
                      "telemetry",
                      "service",
                      "electricity",
                      "foil",
                      "savings",
                    ] as const
                  )
                    .filter((name) => matches(name))
                    .map((name) => (
                      <div key={name}>
                        <BenefitIcon name={name} />
                        <strong>{name}</strong>
                      </div>
                    ))}
                </div>
              </section>
            )}
            <section className={s.panel}>
              <div className={s.sectionTitle}>
                <span>LIVE PREVIEW</span>
                <h2>Из переменных — в интерфейс</h2>
                <p>
                  Для проверки на реальных страницах включите предпросмотр и
                  нажмите «Открыть сайт».
                </p>
              </div>
              <div className={s.heroSample}>
                <Image
                  src="/media/hero.webp"
                  fill
                  sizes="(max-width: 760px) 100vw, 60vw"
                  alt="FLYMAR над водой"
                />
                <div>
                  <span className="micro-label">
                    ELECTRIC. INTELLIGENT. ELEVATED.
                  </span>
                  <h2>
                    Experience the future
                    <br />
                    on water today.
                  </h2>
                  <p>Faster, quieter, and effortlessly stable.</p>
                  <button
                    className="button button-light"
                    onClick={() => setModal(true)}
                  >
                    Get in touch
                    <Arrow diagonal />
                  </button>
                </div>
              </div>
            </section>
            <details className={s.details}>
              <summary>
                Производная палитра · {catalog.colors.length} оттенков
              </summary>
              {catalog.colors
                .filter((t) => matches(t.name))
                .map((t) => (
                  <button key={t.name} onClick={() => copy(t.name)}>
                    <i style={{ background: `var(${t.name})` }} />
                    <code>{t.name}</code>
                    <span>← {tokenName(t.family)}</span>
                  </button>
                ))}
            </details>
          </div>
          <aside className={s.editor} aria-label="Настройки оформления">
            <div className={s.editorHead}>
              <span>THEME STUDIO</span>
              <h2>Настроить ощущение</h2>
              <label>
                <input
                  type="checkbox"
                  checked={preview}
                  onChange={(e) => setPreview(e.target.checked)}
                />{" "}
                Предпросмотр на сайте
              </label>
            </div>
            <div className={s.controls}>
              {[...new Set(fields.map((f) => f.group))].map((group) => (
                <fieldset key={group}>
                  <legend>{group}</legend>
                  {fields
                    .filter(
                      (f) =>
                        f.group === group &&
                        matches(
                          f.label + " " + f.hint + " " + tokenName(f.key),
                        ),
                    )
                    .map((f) => (
                      <label key={f.key} className={s.control}>
                        <span>
                          {f.label}
                          <output>
                            {f.type === "range"
                              ? `${theme[f.key]}${f.unit ?? ""}`
                              : ""}
                          </output>
                        </span>
                        <small>{f.hint}</small>
                        {f.type === "color" ? (
                          <div className={s.colorInput}>
                            <input
                              aria-label={f.label}
                              type="color"
                              value={theme[f.key] as string}
                              onChange={(e) => update(f.key, e.target.value)}
                            />
                            <code>{String(theme[f.key])}</code>
                          </div>
                        ) : f.type === "font" ? (
                          <select
                            aria-label={f.label}
                            value={theme[f.key]}
                            onChange={(e) => update(f.key, e.target.value)}
                          >
                            {Object.keys(fonts).map((k) => (
                              <option key={k} value={k}>
                                {fontLabels[k as keyof typeof fonts]}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            aria-label={f.label}
                            type="range"
                            min={f.min}
                            max={f.max}
                            step={f.step}
                            value={theme[f.key]}
                            onChange={(e) =>
                              update(f.key, Number(e.target.value))
                            }
                          />
                        )}
                        <code className={s.token}>{tokenName(f.key)}</code>
                      </label>
                    ))}
                </fieldset>
              ))}
            </div>
            <div className={s.editorFooter}>
              <div className={s.secondaryActions}>
                <button
                  disabled={!history.length || busy}
                  onClick={() => {
                    const last = history[history.length - 1];
                    setHistory((h) => h.slice(0, -1));
                    setTheme(last);
                  }}
                >
                  Назад
                </button>
                <button
                  disabled={!dirty || busy}
                  onClick={() => change(saved.theme)}
                >
                  Отменить изменения
                </button>
              </div>
              {!authenticated ? (
                <a href="/admin/login" className={s.save}>
                  Войти для сохранения ↗
                </a>
              ) : (
                <button
                  className={s.save}
                  disabled={
                    !dirty ||
                    busy ||
                    saved.storage === "readonly" ||
                    !saved.available
                  }
                  onClick={save}
                >
                  {busy ? "Сохраняем…" : "Сохранить для всего сайта"}
                </button>
              )}
              <p>
                {saved.storage === "readonly"
                  ? "На Vercel публикация станет доступна после подключения базы. Сейчас работают предпросмотр и экспорт."
                  : saved.storage === "file"
                    ? "Сохранение обновляет theme/site-theme.json. На продакшен тема попадёт вместе с публикацией проекта."
                    : "Сохранение применяет тему ко всем страницам и посетителям."}
              </p>
              <div className={s.secondaryActions}>
                <button onClick={exportTheme}>Экспорт JSON</button>
                <button onClick={() => importRef.current?.click()}>
                  Импорт
                </button>
                <button onClick={() => copy(themeCss(theme))}>CSS</button>
              </div>
              <input
                ref={importRef}
                type="file"
                accept="application/json,.json"
                hidden
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  try {
                    if (f.size > 12000) throw new Error();
                    const raw = JSON.parse(await f.text());
                    if (raw.version !== 1) throw new Error();
                    change(validateTheme(raw.theme));
                    setStatus("Тема импортирована в предпросмотр.");
                  } catch {
                    setStatus(
                      "Не удалось импортировать: нужен JSON темы FLYMAR версии 1.",
                    );
                  }
                  e.target.value = "";
                }}
              />
            </div>
          </aside>
        </div>
        <footer className={s.foot}>
          FLYMAR Design System · Foundations / Components / Icons{" "}
          <span>Сохранение защищено доступом администратора.</span>
        </footer>
      </main>
      <dialog
        ref={dialog}
        data-flymar-theme
        style={themeVariables(theme) as CSSProperties}
        className={s.dialog}
        onCancel={() => setModal(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setModal(false);
        }}
      >
        <button
          className={s.close}
          aria-label="Закрыть пример окна"
          onClick={() => setModal(false)}
        >
          ×
        </button>
        <span className="micro-label">LET’S TALK</span>
        <h2>
          A conversation.
          <br />A new beginning.
        </h2>
        <p>
          Образец модального окна. Цвет, шрифт, скругление и тень связаны с
          Foundations.
        </p>
        <button className="button button-dark" onClick={() => setModal(false)}>
          Понятно
          <Arrow diagonal />
        </button>
      </dialog>
    </div>
  );
}
