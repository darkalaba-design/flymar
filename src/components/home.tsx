"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { content, type Locale } from "@/lib/content";
import { track } from "@/lib/analytics";
import { Arrow, Photo, Reveal } from "./visual";
import { FleetCarousel } from "./fleet-carousel";
import { VesselDetail } from "./vessel-detail";
import {
  evolutionCopy,
  productCopy,
  modelHref,
  type ModelId,
} from "@/lib/fleet";

type Modal = "contact" | "technology" | "specs" | "interior" | null;
const sectionIds = ["vessel", "technology", "applications", "about"];
const heroImages = ["hero", "hero-city", "hero-open-water"];
export function Home({ locale, model }: { locale: Locale; model?: ModelId }) {
  const t = content[locale];
  const e = evolutionCopy[locale];
  const homePath = locale === "ru" ? "/ru" : "/";
  const alternatePath = model
    ? modelHref(model, locale === "en" ? "ru" : "en")
    : locale === "en"
      ? "/ru"
      : "/";
  const reduced = useReducedMotion();
  const [slide, setSlide] = useState(0);
  const [modal, setModal] = useState<Modal>(null);
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
  }, [locale]);
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
        className={`header ${scrolled || menu || model ? "header-solid" : ""}`}
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
          {t.nav.map((label, i) => (
            <a key={label} href={`${model ? homePath : ""}#${sectionIds[i]}`}>
              {label}
            </a>
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
            <span>⌄</span>
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
            {t.nav.map((label, i) => (
              <a
                key={label}
                href={`${model ? homePath : ""}#${sectionIds[i]}`}
                onClick={() => setMenu(false)}
              >
                <span>0{i + 1}</span>
                {label}
                <Arrow diagonal />
              </a>
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
        {model ? (
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
                        opacity: { duration: 0.8 },
                        scale: { duration: 7, ease: "linear" },
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
                  transition={{ duration: 1, delay: 0.1 }}
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
                  <a
                    className="button button-light"
                    href="#vessel"
                    onClick={() =>
                      track("cta_click", { source: "hero-explore" })
                    }
                  >
                    {t.explore}
                    <Arrow diagonal />
                  </a>
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
                <p className="eyebrow muted">{e.autonomyLabel}</p>
                <h2>{e.autonomyTitle}</h2>
                <p className="autonomy-intro">{e.autonomyText}</p>
                <div className="autonomy-numbers">
                  <div>
                    <span className="micro-label">{e.upTo}</span>
                    <strong>
                      30<small>{e.knots}</small>
                    </strong>
                    <p>{e.speed}</p>
                  </div>
                  <div>
                    <span className="micro-label">{e.upTo}</span>
                    <strong>
                      70<small>{e.km}</small>
                    </strong>
                    <p>{e.range}</p>
                  </div>
                </div>
                <button
                  className="text-link"
                  onClick={() => open("technology", "autonomy")}
                >
                  {t.techLink}
                  <Arrow diagonal />
                </button>
                <p className="spec-note">{e.autonomyNote}</p>
              </Reveal>
              <div className="autonomy-visual">
                <Photo src="autonomy" alt={e.autonomyImage} />
                <div className="autonomy-photo-top">
                  <span className="status-dot" /> INTELLIGENCE IN MOTION
                </div>
                <div className="autonomy-photo-bottom">
                  <span>FLYMAR / AUTONOMOUS SYSTEMS</span>
                  <span>01 — 03</span>
                </div>
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
                <button
                  className="button button-dark"
                  onClick={() => open("technology", "technology")}
                >
                  {t.techLink}
                  <Arrow diagonal />
                </button>
              </Reveal>
            </section>

            <section id="about" className="about">
              <Photo
                src="hero-open-water"
                alt={
                  locale === "ru"
                    ? "Судно FLYMAR в открытой воде"
                    : "FLYMAR on the open water"
                }
              />
              <div className="about-shade" />
              <Reveal className="about-copy">
                <p className="eyebrow">{t.aboutLabel}</p>
                <h2>{t.aboutHeading}</h2>
                <p>{t.aboutText}</p>
              </Reveal>
              <span className="about-note micro-label">
                LESS NOISE. MORE HORIZON.
              </span>
            </section>

            <section
              id="applications"
              className="applications business-section section-pad"
            >
              <Reveal>
                <p className="eyebrow muted">{t.applicationsLabel}</p>
                <div className="section-heading-row">
                  <h2>{e.businessTitle}</h2>
                  <p className="section-intro">{e.businessIntro}</p>
                </div>
              </Reveal>
              <div className="application-grid">
                {e.business.map((item, i) => (
                  <Reveal key={item.tag} className="application">
                    <button
                      className="application-image"
                      onClick={() =>
                        open("contact", i === 0 ? "urban" : "tourism")
                      }
                      aria-label={`${item.title} — ${t.discuss}`}
                    >
                      <Photo
                        src={i === 0 ? "urban" : "f8-boarding"}
                        alt={item.title}
                      />
                      <span className="application-index">0{i + 1}</span>
                      <span className="circle-button">
                        <Arrow diagonal />
                      </span>
                    </button>
                    <p className="micro-label muted">{item.tag}</p>
                    <h3>{item.title}</h3>
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
          </>
        )}
        <section id="contact" className="contact-section section-pad">
          <Reveal>
            <p className="eyebrow muted">{t.ctaLabel}</p>
            <div className="contact-row">
              <h2>
                {t.ctaHeading[0]}
                <br />
                <span>{t.ctaHeading[1]}</span>
              </h2>
              <div className="contact-side">
                <p>{t.ctaText}</p>
                <button
                  className="button button-light"
                  onClick={() => open("contact", "footer-cta")}
                >
                  {t.cta}
                  <Arrow diagonal />
                </button>
              </div>
            </div>
          </Reveal>
        </section>
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
        <div className="footer-bottom">
          <span>{t.rights}</span>
          <span>ELECTRIC HYDROFOIL TECHNOLOGY</span>
          <div>
            <Link
              href={model ? modelHref(model, "en") : "/"}
              aria-current={locale === "en" ? "page" : undefined}
              scroll={false}
            >
              EN
            </Link>
            <span>/</span>
            <Link
              href={model ? modelHref(model, "ru") : "/ru"}
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
            transition={{ duration: 0.3 }}
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
                <span>×</span>
              </button>
              {modal === "contact" ? (
                <div className="contact-modal-grid">
                  <div className="contact-modal-photo">
                    <Photo src="hero-city" alt="FLYMAR" />
                    <div>
                      <p className="eyebrow">FLYMAR</p>
                      <p>{t.footerTag}</p>
                    </div>
                  </div>
                  <div className="modal-copy">
                    <p className="eyebrow muted">LET’S TALK</p>
                    <h2 id="dialog-title">
                      {formState === "success" ? t.successTitle : t.formTitle}
                    </h2>
                    {formState === "success" ? (
                      <div role="status">
                        <p>{t.successText}</p>
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
                        <p className="modal-intro">{t.formIntro}</p>
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
                    <h2 id="dialog-title">{t.interiorTitle}</h2>
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
