"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  defaults,
  validateTheme,
  themeVariables,
  type Theme,
} from "@/lib/design/theme";

const ThemeContext = createContext<Theme>({ ...defaults });
export const useSiteTheme = () => useContext(ThemeContext);
export const DRAFT_KEY = "flymar-theme-draft-v1";
export const THEME_EVENT = "flymar-theme-change";
export function applyTheme(theme: Theme) {
  document.documentElement.dataset.motion = String(theme.motion);
  for (const [key, value] of Object.entries(themeVariables(theme)))
    document.documentElement.style.setProperty(key, value);
}
export function setThemeDraft(theme: Theme | null) {
  try {
    if (theme) sessionStorage.setItem(DRAFT_KEY, JSON.stringify(theme));
    else sessionStorage.removeItem(DRAFT_KEY);
  } catch {}
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }));
}
export function ThemeProvider({
  initial,
  children,
}: {
  initial: Theme;
  children: ReactNode;
}) {
  const [theme, setTheme] = useState(initial);
  const [preview, setPreview] = useState(false);
  useEffect(() => {
    let saved = initial,
      alive = true;
    const useSaved = () => {
      let draft: Theme | null = null;
      try {
        const raw = sessionStorage.getItem(DRAFT_KEY);
        if (raw) draft = validateTheme(JSON.parse(raw));
      } catch {
        try {
          sessionStorage.removeItem(DRAFT_KEY);
        } catch {}
      }
      if (!alive) return;
      const active = draft ?? saved;
      applyTheme(active);
      setTheme(active);
      setPreview(!!draft);
    };
    const refresh = async () => {
      try {
        const r = await fetch("/api/theme", { cache: "no-store" });
        if (r.ok) {
          const data = await r.json();
          saved = validateTheme(data.theme);
          useSaved();
        }
      } catch {}
    };
    useSaved();
    window.addEventListener(THEME_EVENT, useSaved);
    window.addEventListener("focus", refresh);
    const listener = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", listener);
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, 30000);
    return () => {
      alive = false;
      clearInterval(timer);
      window.removeEventListener(THEME_EVENT, useSaved);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", listener);
    };
  }, [initial]);
  return (
    <ThemeContext.Provider value={theme}>
      {children}
      {preview && (
        <aside className="theme-preview-banner">
          <span>Личный предпросмотр оформления</span>
          <a href="/ui-kit">UI Kit</a>
          <button
            onClick={() => {
              setThemeDraft(null);
              location.reload();
            }}
          >
            Завершить
          </button>
        </aside>
      )}
    </ThemeContext.Provider>
  );
}
