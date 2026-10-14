"use client";

import Image from "next/image";
import { useSiteTheme } from "./theme-provider";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { content, type Locale } from "@/lib/content";
import { track, trackingContext } from "@/lib/analytics";
import { Arrow, Photo, Reveal } from "./visual";
import { FleetCarousel } from "./fleet-carousel";
import { BusinessBenefits } from "./business-benefits";
import { VesselDetail } from "./vessel-detail";
import { positioning } from "@/lib/positioning";
import { CompanyPage } from "./company-page";
import {
  companyHref,
  companyCopy,
  type CompanyPage as CompanyPageName,
} from "@/lib/company";
import {
  evolutionCopy,
  productCopy,
  modelHref,
  type ModelId,
} from "@/lib/fleet";

type Modal = "contact" | "technology" | "specs" | "interior" | null;
const heroImages = ["hero", "hero-city", "hero-open-water"];
export function Home({
  locale,
  model,
  page,
}: {
  locale: Locale;
  model?: ModelId;
  page?: CompanyPageName;
}) {
  const theme = useSiteTheme();
  const t = content[locale];
  const e = evolutionCopy[locale];
  const identity = model ? positioning[locale][model] : null;
  const homePath = locale === "ru" ? "/ru" : "/";
  const navigation = [
    { label: "FLYMAR F8", href: modelHref("f8", locale), model: "f8" },
    { label: "FLYMAR F11", href: modelHref("f11", locale), model: "f11" },
    {
      label: companyCopy[locale].labels.technology,
      href: companyHref("technology", locale),
      page: "technology",
    },
    { label: t.nav[2], href: `${model || page ? homePath : ""}#applications` },
    {
      label: companyCopy[locale].labels.about,
      href: companyHref("about", locale),
      page: "about",
    },
    {
      label: companyCopy[locale].labels.contacts,
      href: companyHref("contacts", locale),
      page: "contacts",
    },
  ];
  const alternatePath = page
    ? companyHref(page, locale === "en" ? "ru" : "en")
    : model
      ? modelHref(model, locale === "en" ? "ru" : "en")
      : locale === "en"
        ? "/ru"
        : "/";
  const reduced = useReducedMotion();
  const [slide, setSlide] = useState(0);
  const [modal, setModal] = useState<Modal>(null);
  const [previewSubmission, setPreviewSubmission] = useState(false);
  const enquiryId = useRef<string | null>(null);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [formState, setFormState] = useState<
    "idle" | "sending" | "success" | "error" | "unavailable"
  >("idle");
  const formStarted = useRef(false);
  const seen = useRef(new Set<string>());

  useEffect(() => {
    document.documentElement.lang = locale;
    track("page_view", { locale });
    const scroll = () => setScrolled(window.scrollY > 40);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting && !seen.current.has(entry.target.id)) {
            seen.current.add(entry.target.id);
            track("section_view", { section: entry.target.id, locale });
          }
        }),
      { threshold: 0.2 },
    );
    document
      .querySelectorAll("section[id]")
      .forEach((el) => observer.observe(el));
    return () => {
      window.removeEventListener("scroll", scroll);
      observer.disconnect();
    };
  }, [locale, model, page]);
  useEffect(() => {
    if (modal) {
      dialogRef.current?.showModal();
      dialogRef.current
        ?.querySelector<HTMLButtonElement>(".modal-close")
        ?.focus();
      track("modal_open", { modal, locale });
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [modal, locale]);
  useEffect(() => {
    if (!menu) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [menu]);
  function open(which: Exclude<Modal, null>, source: string) {
    returnFocus.current = document.activeElement as HTMLElement;
    setFormState("idle");
    setPreviewSubmission(false);
    enquiryId.current = null;
    formStarted.current = false;
    setMenu(false);
    setModal(which);
    track("cta_click", { source, locale });
  }
  function changeSlide(next: number) {
    const index = (next + heroImages.length) % heroImages.length;
    setSlide(index);
    track("hero_change", { slide: index });
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (formState === "sending") return;
    const form = new FormData(event.currentTarget);
    const attribution = trackingContext();
    enquiryId.current ??= crypto.randomUUID();
    setFormState("sending");
    track("form_submit", { locale });
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          company: form.get("company"),
          message: form.get("message"),
          website: form.get("website"),
          consent: form.get("consent") === "on",
          locale,
          requestId: enquiryId.current,
          sessionId: attribution?.sessionId,
          attribution: attribution?.attribution,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok) {
        setFormState(
          result.error === "not_configured" ? "unavailable" : "error",
        );
        track("form_error", { reason: result.error ?? "server_error" });
        return;
      }
      setPreviewSubmission(result.mode === "preview");
      setFormState("success");
      track("form_success", { locale });
    } catch {
      setFormState("error");
      track("form_error", { reason: "network_error" });
    }
  }
  const stats = (
    <div className="spec-stats">
      {[
        ["10", t.passengers, ""],
        ["22", t.speed, t.knots],
        ["40", t.range, t.nm],
      ].map(([value, label, unit]) => (
        <div key={label}>
          <div className="stat-value">
            {value}
            <span>{unit}</span>
          </div>
          <span className="stat-label">{label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <a href="#main" className="skip-link">
        {locale === "ru" ? "К содержимому" : "Skip to content"}
      </a>
      <header
        className={`header ${scrolled || menu || model || (page && page !== "technology") ? "header-solid" : ""} ${model === "f11" ? "header-engineering" : ""}`}
      >
        <Link
          href={locale === "ru" ? "/ru" : "/"}
          className="brand"
          aria-label="FLYMAR"
        >
          <Image
            src="/media/logo.svg"
            alt="FLYMAR"
            width={180}
            height={40}
            priority
          />
        </Link>
        <nav
          className="desktop-nav"
          aria-label={
            locale === "ru" ? "Основная навигация" : "Main navigation"
          }
        >
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={(page && page === item.page) || (model && model === item.model) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            className="locale"
            href={alternatePath}
            scroll={false}
            aria-label={
              locale === "en" ? "Переключить на русский" : "Switch to English"
            }
          >
            {locale === "en" ? "EN" : "RU"}
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="m3 4.5 3 3 3-3"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <button
            className="header-cta"
            onClick={() => open("contact", "header")}
          >
            {t.contact}
            <Arrow diagonal />
          </button>
          <button
            aria-label={menu ? t.close : t.menu}
            aria-expanded={menu}
            aria-controls="mobile-nav"
            className={`menu-toggle ${menu ? "is-open" : ""}`}
            onClick={() => setMenu(!menu)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <AnimatePresence>
        {menu && (
          <motion.nav
            id="mobile-nav"
            className="mobile-nav"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            {navigation.map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={(page && page === item.page) || (model && model === item.model) ? "page" : undefined}
                onClick={() => setMenu(false)}
              >
                <span>0{i + 1}</span>
                {item.label}
                <Arrow diagonal />
              </Link>
            ))}
            <button
              className="button button-light"
              onClick={() => open("contact", "mobile-menu")}
            >
              {t.contact}
              <Arrow />
            </button>
          </motion.nav>
        )}
      </AnimatePresence>

      <main id="main">
        {page ? (
          <CompanyPage
            page={page}
            locale={locale}
            onContact={() => open("contact", `${page}-contact`)}
          />
        ) : model ? (
          <VesselDetail
            key={model}
            model={model}
            locale={locale}
            onContact={() => open("contact", `product-${model}`)}
            onInterior={() => open("interior", `product-interior-${model}`)}
          />
        ) : (
          <>
            <section className={`hero hero-slide-${slide}`} id="top">
              <div className="hero-photographs">
                <AnimatePresence initial={false}>
                  {
                    <motion.div
                      key={slide}
                      className="hero-photo"
                      initial={{ opacity: 0, scale: reduced ? 1 : 1.035 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        opacity: { duration: 0.8 * theme.motion },
                        scale: { duration: 7 * theme.motion, ease: "linear" },
                      }}
                    >
                      <Photo
                        src={heroImages[slide]}
                        alt={
                          locale === "ru"
                            ? "FLYMAR F8 на подводных крыльях"
                            : "FLYMAR F8 flying above the water"
                        }
                        priority={slide === 0}
                      />
                    </motion.div>
                  }
                </AnimatePresence>
              </div>
              <div className="hero-shade" />
              <div className="hero-content" aria-live="polite">
                <motion.div
                  key={slide}
                  initial={reduced ? false : { opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1 * theme.motion,
                    delay: 0.1 * theme.motion,
                  }}
                >
                  <p className="eyebrow hero-eyebrow">
                    <span className="status-dot" />
                    {t.eyebrow}
                  </p>
                  <h1>
                    {e.hero[slide].title[0]}
                    <br />
                    <span>{e.hero[slide].title[1]}</span>
                  </h1>
                  <p className="hero-intro">{e.hero[slide].description}</p>
                  <button
                    className="button button-light"
                    onClick={() => open("contact", "hero-contact")}
                  >
                    {t.contact}
                    <Arrow diagonal />
                  </button>
                </motion.div>
              </div>
              <div className="hero-bottom">
                <a href="#vision" className="scroll-cue">
                  <span className="scroll-icon">↓</span>
                  {t.discover}
                </a>
                <div className="hero-pagination">
                  <span className="slide-caption" aria-live="polite">
                    {t.heroCaptions[slide]}
                  </span>
                  <div className="slide-controls">
                    <button
                      className="circle-button"
                      aria-label={t.previous}
                      onClick={() => changeSlide(slide - 1)}
                    >
                      <Arrow className="rotate-180" />
                    </button>
                    <span className="slide-number">
                      0{slide + 1}
                      <i>/</i>03
                    </span>
                    <button
                      className="circle-button"
                      aria-label={t.next}
                      onClick={() => changeSlide(slide + 1)}
                    >
                      <Arrow />
                    </button>
                  </div>
                </div>
              </div>
              <span className="hero-side-label" aria-hidden="true">
                DESIGNED TO RISE ABOVE
              </span>
            </section>

            <section id="vision" className="autonomy-section">
              <Reveal className="autonomy-copy">
                <h2>{e.autonomyTitle}</h2>

                <div className="autonomy-numbers">
                  <div>
                    <span className="micro-label">{e.upTo}</span>
                    <strong>
                      30<small>{e.knots}</small>
                    </strong>
                  </div>
                  <div>
                    <strong>
                      70<small>{e.km}</small>
                    </strong>
                    <p>{e.range}</p>
                  </div>
                </div>
                <button
                  className="button button-dark"
                  onClick={() => open("contact", "autonomy-contact")}
                >
                  {t.contact}
                  <Arrow diagonal />
                </button>
              </Reveal>
              <div className="autonomy-visual">
                <Photo src="autonomy-control" alt={e.autonomyImage} />
              </div>
            </section>
            <FleetCarousel
              locale={locale}
              onContact={(source) => open("contact", source)}
            />

            <section id="technology" className="technology">
              <div className="technology-photo">
                <Photo
                  src="intelligence"
                  alt={
                    locale === "ru"
                      ? "Собственная электроника FLYMAR"
                      : "FLYMAR intelligent navigation hardware"
                  }
                />
                <div className="tech-photo-label">
                  <span className="status-dot" /> FLYMAR INTELLIGENCE{" "}
                  <span>01 — 03</span>
                </div>
              </div>
              <Reveal className="technology-copy">
                <p className="eyebrow muted">{t.techLabel}</p>
                <h2>{t.techHeading}</h2>
                <p>{t.techBody}</p>
                <div className="tech-list">
                  {t.techTags.map((tag, i) => (
                    <div key={tag}>
                      <span>0{i + 1}</span>
                      {tag}
                      <span className="plus">+</span>
                    </div>
                  ))}
                </div>
                <Link
                  className="button button-dark"
                  href={companyHref("technology", locale)}
                >
                  {t.techLink}
                  <Arrow diagonal />
                </Link>
              </Reveal>
            </section>

            <section id="about" className="about">
              <Photo
                src="hero-open-water"
                alt={locale === "ru" ? "Судно FLYMAR в открытой воде" : "FLYMAR on the open water"}
              />
              <div className="about-shade" />
              <Reveal className="about-copy">
                <p className="eyebrow">{t.aboutLabel}</p>
                <h2>{t.aboutHeading}</h2>
                <p>{t.aboutText}</p>
                <Link className="text-link" href={companyHref("about", locale)}>
                  {locale === "ru" ? "Больше о компании" : "Meet FLYMAR"}
                  <Arrow diagonal />
                </Link>
              </Reveal>
              <span className="about-note micro-label">
                LESS NOISE. MORE HORIZON.
              </span>
            </section>

            <BusinessBenefits locale={locale} variant="savings" />

            <section
              id="applications"
              className="applications business-section section-pad"
            >
              <Reveal>
                <p className="eyebrow muted">{t.applicationsLabel}</p>
                <div className="section-heading-row">
                  <h2>{e.businessTitle}</h2>
                </div>
              </Reveal>
              <div className="application-grid">
                {e.business.map((item, i) => (
                  <Reveal key={item.tag} className="application">
                    <div className="application-heading">
                      <p className="micro-label muted">{item.tag}</p>
                      <h3>{item.title}</h3>
                    </div>
                    <Link
                      className="application-image"
                      href={modelHref(i === 0 ? "f11" : "f8", locale)}
                      aria-label={`${item.title} — FLYMAR ${i === 0 ? "F11" : "F8"}`}
                    >
                      <Photo
                        src={
                          i === 0 ? "application-resort" : "application-city"
                        }
                        alt={item.title}
                      />
                      <span className="application-index">0{i + 1}</span>
                      <span className="circle-button">
                        <Arrow diagonal />
                      </span>
                    </Link>

                    <p className="application-description">{item.text}</p>
                    <button
                      className="text-link"
                      onClick={() =>
                        open("contact", i === 0 ? "urban-link" : "tourism-link")
                      }
                    >
                      {t.discuss}
                      <Arrow diagonal />
                    </button>
                  </Reveal>
                ))}
              </div>
            </section>
            <BusinessBenefits
              locale={locale}
              variant="management"
              onContact={() => open("contact", "fleet-management")}
            />
          </>
        )}
        {page !== "contacts" && (
          <section
            id="contact"
            className={`contact-section section-pad ${model === "f11" ? "contact-transit" : ""}`}
          >
            <Reveal>
              <p className="eyebrow muted">
                {identity?.category ?? t.ctaLabel}
              </p>
              <div className="contact-row">
                <h2>
                  {identity?.cta[0] ?? t.ctaHeading[0]}
                  <br />
                  <span>{identity?.cta[1] ?? t.ctaHeading[1]}</span>
                </h2>
                <div className="contact-side">
                  <p>{identity?.ctaText ?? t.ctaText}</p>
                  <button
                    className="button button-light"
                    onClick={() => open("contact", "footer-cta")}
                  >
                    {identity?.contact ?? t.cta}
                    <Arrow diagonal />
                  </button>
                </div>
              </div>
            </Reveal>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="footer-main">
          <Link
            href={locale === "ru" ? "/ru" : "/"}
            aria-label="FLYMAR"
            className="brand"
          >
            <Image src="/media/logo.svg" alt="FLYMAR" width={180} height={40} />
          </Link>
          <span>{t.footerTag}</span>
          <a href="#top" className="text-link">
            {t.top}
            <Arrow className="-rotate-90" />
          </a>
        </div>
        <nav
          className="footer-pages"
          aria-label={locale === "ru" ? "Страницы сайта" : "Site pages"}
        >
          {(["about", "technology", "contacts"] as const).map((id) => (
            <Link key={id} href={companyHref(id, locale)}>
              {companyCopy[locale].labels[id]}
            </Link>
          ))}
          <a href="mailto:hello@flymar.tech">hello@flymar.tech</a>
        </nav>
        <div className="footer-bottom">
          <span>{t.rights}</span>
          <span>ELECTRIC HYDROFOIL TECHNOLOGY</span>
          <div>
            <Link
              href={
                page
                  ? companyHref(page, "en")
                  : model
                    ? modelHref(model, "en")
                    : "/"
              }
              aria-current={locale === "en" ? "page" : undefined}
              scroll={false}
            >
              EN
            </Link>
            <span>/</span>
            <Link
              href={
                page
                  ? companyHref(page, "ru")
                  : model
                    ? modelHref(model, "ru")
                    : "/ru"
              }
              aria-current={locale === "ru" ? "page" : undefined}
              scroll={false}
            >
              RU
            </Link>
          </div>
        </div>
      </footer>

      <AnimatePresence onExitComplete={() => returnFocus.current?.focus()}>
        {modal && (
          <motion.dialog
            ref={dialogRef}
            className={`modal ${modal === "contact" ? "contact-modal" : ""}`}
            initial={{
              opacity: 0,
              y: reduced ? 0 : 32,
              scale: reduced ? 1 : 0.98,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduced ? 0 : 20 }}
            transition={{ duration: 0.3 * theme.motion }}
            aria-labelledby="dialog-title"
            onCancel={(event) => {
              event.preventDefault();
              setModal(null);
            }}
            onClick={(event) => {
              if (event.target === event.currentTarget) setModal(null);
            }}
          >
            <div className="modal-inner">
              <button
                className="modal-close circle-button"
                aria-label={t.close}
                onClick={() => setModal(null)}
                autoFocus
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
              {modal === "contact" ? (
                <div className="contact-modal-grid">
                  <div
                    className={`contact-modal-photo ${model === "f11" ? "contact-modal-transit" : ""}`}
                  >
                    <Photo
                      src={model === "f11" ? "f11-profile" : "hero-city"}
                      alt={model ? `FLYMAR ${model.toUpperCase()}` : "FLYMAR"}
                    />
                    <div>
                      <p className="eyebrow">FLYMAR</p>
                      <p>{identity?.promise ?? t.footerTag}</p>
                    </div>
                  </div>
                  <div className="modal-copy">
                    <p className="eyebrow muted">LET’S TALK</p>
                    <h2 id="dialog-title">
                      {formState === "success"
                        ? t.successTitle
                        : (identity?.contact ?? t.formTitle)}
                    </h2>
                    {formState === "success" ? (
                      <div role="status">
                        <p>
                          {previewSubmission
                            ? locale === "ru"
                              ? "Тестовая заявка сохранена во временной админке. Данные будут сброшены при перезапуске сервера."
                              : "Your test enquiry is saved in the preview admin. This temporary data resets when the server restarts."
                            : t.successText}
                        </p>
                        <button
                          className="button button-dark mt-8"
                          onClick={() => setModal(null)}
                        >
                          {t.close}
                          <Arrow />
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="modal-intro">
                          {identity?.ctaText ?? t.formIntro}
                        </p>
                        <form
                          onSubmit={submit}
                          onFocus={() => {
                            if (!formStarted.current) {
                              formStarted.current = true;
                              track("form_start", { locale });
                            }
                          }}
                        >
                          <div className="form-row">
                            <label>
                              {t.name}
                              <input
                                name="name"
                                autoComplete="name"
                                maxLength={120}
                                required
                              />
                            </label>
                            <label>
                              {t.email}
                              <input
                                name="email"
                                type="email"
                                autoComplete="email"
                                maxLength={254}
                                required
                              />
                            </label>
                          </div>
                          <label>
                            {t.company}
                            <span className="optional">{t.optional}</span>
                            <input
                              name="company"
                              autoComplete="organization"
                              maxLength={200}
                            />
                          </label>
                          <label>
                            {t.message}
                            <span className="optional">{t.optional}</span>
                            <textarea
                              name="message"
                              rows={2}
                              maxLength={3000}
                            />
                          </label>
                          <div className="honeypot" aria-hidden="true">
                            <label>
                              Website
                              <input
                                name="website"
                                tabIndex={-1}
                                autoComplete="off"
                              />
                            </label>
                          </div>
                          <label className="consent">
                            <input type="checkbox" name="consent" required />
                            <span>{t.consent}</span>
                          </label>
                          {(formState === "error" ||
                            formState === "unavailable") && (
                            <p className="form-error" role="alert">
                              {formState === "unavailable"
                                ? t.unavailable
                                : t.error}
                            </p>
                          )}
                          <button
                            className="button button-dark form-submit"
                            type="submit"
                            disabled={formState === "sending"}
                          >
                            {formState === "sending" ? t.sending : t.submit}
                            <Arrow diagonal />
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              ) : modal === "technology" ? (
                <div className="modal-copy">
                  <p className="eyebrow muted">AUTONOMY FIRST</p>
                  <h2 id="dialog-title">{t.techModalTitle}</h2>
                  <p className="modal-intro">{t.techModalIntro}</p>
                  <div className="tech-modal-grid">
                    {t.techDetails.map((item, i) => (
                      <article key={item.title}>
                        <div className="tech-detail-photo">
                          <Photo
                            src={["intelligence", "foils", "motor"][i]}
                            alt={item.title}
                          />
                        </div>
                        <span className="micro-label muted">0{i + 1}</span>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                      </article>
                    ))}
                  </div>
                  <button
                    className="button button-dark mt-8"
                    onClick={() => setModal("contact")}
                  >
                    {t.contact}
                    <Arrow diagonal />
                  </button>
                </div>
              ) : modal === "specs" ? (
                <div className="modal-copy">
                  <p className="eyebrow muted">100% ELECTRIC HYDROFOIL</p>
                  <h2 id="dialog-title">{t.specsTitle}</h2>
                  <p className="modal-intro">{t.specsIntro}</p>
                  <div className="spec-modal-image">
                    <Photo src="vessel" alt="FLYMAR F8" />
                  </div>
                  {stats}
                  <ul className="spec-features">
                    {t.specsFeatures.map((feature) => (
                      <li key={feature}>
                        <span>↗</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <p className="spec-note">{t.vesselNote}</p>
                  <button
                    className="button button-dark"
                    onClick={() => setModal("contact")}
                  >
                    {t.cta}
                    <Arrow diagonal />
                  </button>
                </div>
              ) : (
                <div className="interior-modal">
                  <div className="interior-image">
                    <Photo
                      src={model === "f11" ? "f11-interior" : "interior"}
                      alt={
                        locale === "ru"
                          ? `Пассажирский салон FLYMAR ${(model || "f8").toUpperCase()}`
                          : `FLYMAR ${(model || "f8").toUpperCase()} passenger interior`
                      }
                    />
                  </div>
                  <div className="modal-copy">
                    <p className="eyebrow muted">
                      INSIDE THE {(model || "f8").toUpperCase()}
                    </p>
                    <h2 id="dialog-title">
                      {identity?.inside ?? t.interiorTitle}
                    </h2>
                    <p>
                      {model
                        ? productCopy[locale][model].story
                        : t.benefits[1].text}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.dialog>
        )}
      </AnimatePresence>
    </>
  );
}
