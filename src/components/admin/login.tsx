"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
export function AdminLogin() {
  const router = useRouter();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [visible, setVisible] = useState(false),
    [lockedUntil, setLockedUntil] = useState(0),
    [remaining, setRemaining] = useState(0);
  useEffect(() => {
    if (!lockedUntil) return;
    const update = () =>
      setRemaining(Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000)));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [lockedUntil]);
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || remaining) return;
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.get("username"),
          password: form.get("password"),
        }),
      });
      const result = await response.json();
      if (response.status === 429) {
        setLockedUntil(Date.now() + (result.retryAfter || 900) * 1000);
        setError(
          "Слишком много попыток входа. Попробуйте после окончания паузы.",
        );
        return;
      }
      if (!response.ok) {
        setError(
          response.status === 401
            ? "Неверный логин или пароль."
            : response.status === 403
              ? "Вход с этого адреса запрещён. Проверьте адрес сайта в настройках сервера (NEXT_PUBLIC_SITE_URL)."
              : response.status === 503
                ? "Вход не настроен на этом сервере. Проверьте конфигурацию и подключение хранилища."
                : "Сервер не смог выполнить вход. Попробуйте позже.",
        );
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Не удалось связаться с сервером. Попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="admin-login">
      <div className="admin-login-story">
        <Image src="/media/logo.svg" width={190} height={42} alt="FLYMAR" />
        <div>
          <p className="admin-kicker">CONTROL CENTRE</p>
          <h1>
            Ясная картина.
            <br />
            Уверенные решения.
          </h1>
          <p>
            Посещения, обращения и коммуникация с клиентами — в одном месте.
          </p>
        </div>
        <span>FLYMAR / WEBSITE OPERATIONS</span>
      </div>
      <div className="admin-login-panel">
        <Link href="/" className="admin-back">
          ← На сайт
        </Link>
        <div className="admin-login-form">
          <p className="admin-kicker">ДОСТУП АДМИНИСТРАТОРА</p>
          <h2>С возвращением.</h2>
          <p>Войдите, чтобы управлять сайтом.</p>
          <form onSubmit={login}>
            <label htmlFor="admin-username">Логин</label>
            <input
              id="admin-username"
              name="username"
              autoComplete="username"
              required
              defaultValue="admin"
              maxLength={100}
            />
            <label htmlFor="admin-password">Пароль</label>
            <div className="admin-password">
              <input
                id="admin-password"
                name="password"
                type={visible ? "text" : "password"}
                autoComplete="current-password"
                required
                maxLength={256}
              />
              <button
                type="button"
                aria-pressed={visible}
                onClick={() => setVisible(!visible)}
              >
                {visible ? "Скрыть" : "Показать"}
              </button>
            </div>
            {error && (
              <p role="alert" className="admin-error">
                {error}
              </p>
            )}
            {remaining > 0 && (
              <p role="status">
                Повторный вход через {Math.floor(remaining / 60)}:
                {String(remaining % 60).padStart(2, "0")}
              </p>
            )}
            <button className="admin-primary" disabled={busy || remaining > 0}>
              {busy ? "Входим…" : "Войти в админку"}
              <span>↗</span>
            </button>
          </form>
          <p className="admin-login-note">
            Доступ защищён. После нескольких попыток вход временно блокируется.
          </p>
        </div>
      </div>
    </main>
  );
}
