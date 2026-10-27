"use client";
import { useState } from "react";
import { useSiteTheme } from "./theme-provider";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Arrow, Photo, Reveal } from "./visual";
import { productCopy, fleetCopy, modelHref, type ModelId } from "@/lib/fleet";
import type { Locale } from "@/lib/content";
import { track } from "@/lib/analytics";
import { positioning } from "@/lib/positioning";
import { TransitOperations } from "./product-purpose";
import { F8Business } from "./f8-business";
import { F8Intelligence } from "./f8-intelligence";

export function VesselDetail({
  model,
  locale,
  onContact,
  onInterior,
}: {
  model: ModelId;
  locale: Locale;
  onContact: () => void;
  onInterior: () => void;
}) {
  const t = productCopy[locale],
    p = t[model],
    summary = fleetCopy[locale][model];
  const [frame, setFrame] = useState(0);
  const reduced = useReducedMotion();
  const theme = useSiteTheme();
  const other = model === "f8" ? "f11" : "f8";
  const identity = positioning[locale][model];
  function change(index: number) {
    setFrame((index + p.photos.length) % p.photos.length);
    track("cta_click", { source: "product_gallery", model });
  }
  return (
    <div className={`vessel-page vessel-page-${model}`}>
      <section id="top" className={`product-hero product-${model}`}>
        <div className="product-hero-copy">
          <Link
            className="product-back"
            href={`${locale === "ru" ? "/ru" : "/"}#vessel`}
          >
            <Arrow className="rotate-180" />
            {t.back}
          </Link>
          {model === "f11" && (
            <div className="product-launch-status">
              <span />
              Coming Soon
            </div>
          )}
          <p className="eyebrow muted">{p.eyebrow}</p>
          <div className="product-model-name">
            FLYMAR <span>{model.toUpperCase()}</span>
          </div>
          <h1>{p.title}</h1>
          <p className="product-intro">{p.intro}</p>
          <button className="button button-dark" onClick={onContact}>
            {identity.contact}
            <Arrow diagonal />
          </button>
        </div>
        <div className="product-hero-image">
          <Photo
            src={model === "f8" ? "f8-main-extended" : "f11-profile"}
            alt={`FLYMAR ${model.toUpperCase()}`}
            priority
          />
          {model === "f11" && <div className="product-image-caption">
            <span>FLYMAR {model.toUpperCase()}</span>
            <a href="#operations">
              {locale === "ru"
                  ? "Для операторов"
                  : "Operator brief"}
              <Arrow className="rotate-90" />
            </a>
          </div>}
        </div>
      </section>
      {model === "f11" && <nav
        className="product-section-nav"
        aria-label={locale === "ru" ? "Разделы модели" : "Model sections"}
      >
        <span>FLYMAR {model.toUpperCase()}</span>
            <a href="#operations">
              {locale === "ru" ? "Маршруты и флот" : "Routes & fleet"}
            </a>
            <a href="#economics">
              {locale === "ru" ? "Экономика" : "Operating economics"}
            </a>
            <a href="#interior">{locale === "ru" ? "Концепция" : "Concept"}</a>
      </nav>}
      {model === "f8" ? (
        <section className="product-numbers" aria-label={t.specs}>
          {summary.stats.map(([value, label]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </section>
      ) : (
        <div className="transit-launch-strip">
          <strong>Coming Soon</strong>
          <p>
            {locale === "ru"
              ? "F11 в разработке. Сейчас — диалог с операторами и транспортными партнёрами. Технические характеристики будут представлены к запуску."
              : "F11 is in development. We’re opening the conversation with operators and transit partners. Technical specifications will be shared at launch."}
          </p>
          <button className="text-link" onClick={onContact}>
            {locale === "ru" ? "Обсудить проект" : "Discuss a project"}
            <Arrow diagonal />
          </button>
        </div>
      )}
      {model === "f11" && (
        <TransitOperations locale={locale} onContact={onContact} />
      )}
      <section id="interior" className="product-story section-pad">
        <Reveal>
          <p className="eyebrow muted">
            {model === "f8" ? "02" : "03"} / {identity.inside.toUpperCase()}
          </p>
          <div className="section-heading-row">
            <h2>{p.storyTitle}</h2>
            <p className="section-intro">{p.story}</p>
          </div>
        </Reveal>
        <Reveal className="product-interior">
          <Photo
            src={model === "f8" ? "f8-comfort" : "f11-interior"}
            alt={identity.inside}
          />
          {model === "f11" && <button className="button button-light" onClick={onInterior}>
            {identity.view}
            <Arrow diagonal />
          </button>}
        </Reveal>
        {model === "f8" && (
          <div className="product-features">
            {p.features.map((feature, i) => (
              <div key={feature}>
                <span>0{i + 1}</span>
                <h3>{feature}</h3>
              </div>
            ))}
          </div>
        )}
      </section>
      {model === "f8" && <F8Business locale={locale} />}
      {model === "f8" && <F8Intelligence locale={locale} />}
      {model === "f8" && (
        <section
          id="specifications"
          className="product-engineering section-pad"
        >
          <Reveal className="engineering-copy">
            <p className="eyebrow muted">05 / {t.specs.toUpperCase()}</p>
            <h2>{p.engineeringTitle}</h2>
            <div className="engineering-image">
              <Photo src="f8-performance" alt="FLYMAR F8" />
            </div>
          </Reveal>
          <Reveal className="product-specification-list">
            <dl>
              {p.specifications.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <p className="spec-note">{p.note}</p>
            <button className="text-link" onClick={onContact}>
              {identity.contact}
              <Arrow diagonal />
            </button>
          </Reveal>
        </section>
      )}
      <section
        className="product-gallery section-pad"
        aria-roledescription={locale === "ru" ? "Карусель" : "Carousel"}
        aria-label={identity.gallery}
      >
        <div className="product-gallery-heading">
          <h2>{identity.gallery}</h2>
          <div className="fleet-controls">
            <span className="micro-label">0{frame + 1} / 04</span>
            <button
              className="circle-button"
              aria-label={t.previous}
              onClick={() => change(frame - 1)}
            >
              <Arrow className="rotate-180" />
            </button>
            <button
              className="circle-button"
              aria-label={t.next}
              onClick={() => change(frame + 1)}
            >
              <Arrow />
            </button>
          </div>
        </div>
        <div className="product-gallery-stage">
          <AnimatePresence initial={false}>
            <motion.div
              key={frame}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.45 * theme.motion }}
            >
              <Photo src={p.photos[frame]} alt={p.captions[frame]} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="product-gallery-caption">
          <p aria-live="polite">{p.captions[frame]}</p>
          <div>
            {p.photos.map((photo, i) => (
              <button
                key={photo}
                aria-label={p.captions[i]}
                aria-pressed={frame === i}
                onClick={() => change(i)}
              >
                <span />
              </button>
            ))}
          </div>
        </div>
      </section>
      {model === "f8" && (
        <section className="product-next section-pad">
          <div>
            <p className="eyebrow muted">
              {locale === "ru" ? "ПРОДОЛЖИТЬ ЗНАКОМСТВО" : "CONTINUE EXPLORING"}
            </p>
            <h2>
              FLYMAR {other.toUpperCase()}{" "}
              <span className="product-next-status">Coming Soon</span>
            </h2>
            <p className="product-other-purpose">
              {positioning[locale][other].promise}
            </p>
          </div>
          <Link href={modelHref(other, locale)} className="button button-dark">
            {fleetCopy[locale].details}
            <Arrow diagonal />
          </Link>
        </section>
      )}
    </div>
  );
}
