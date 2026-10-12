"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Arrow, Photo, Reveal } from "./visual";
import { productCopy, fleetCopy, modelHref, type ModelId } from "@/lib/fleet";
import type { Locale } from "@/lib/content";
import { track } from "@/lib/analytics";

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
  const other = model === "f8" ? "f11" : "f8";
  function change(index: number) {
    setFrame((index + p.photos.length) % p.photos.length);
    track("cta_click", { source: "product_gallery", model });
  }
  return (
    <>
      <section id="top" className={`product-hero product-${model}`}>
        <div className="product-hero-copy">
          <Link
            className="product-back"
            href={`${locale === "ru" ? "/ru" : "/"}#vessel`}
          >
            <Arrow className="rotate-180" />
            {t.back}
          </Link>
          <p className="eyebrow muted">{p.eyebrow}</p>
          <div className="product-model-name">
            FLYMAR <span>{model.toUpperCase()}</span>
          </div>
          <h1>{p.title}</h1>
          <p className="product-intro">{p.intro}</p>
          <button className="button button-dark" onClick={onContact}>
            {t.contact}
            <Arrow diagonal />
          </button>
        </div>
        <div className="product-hero-image">
          <Photo
            src={model === "f8" ? "hero" : "f11-hero"}
            alt={`FLYMAR ${model.toUpperCase()}`}
            priority
          />
          <div className="product-image-caption">
            <span>FLYMAR {model.toUpperCase()}</span>
            <a href="#specifications">
              {t.specs}
              <Arrow className="rotate-90" />
            </a>
          </div>
        </div>
      </section>
      <section className="product-numbers" aria-label={t.specs}>
        {summary.stats.map(([value, label]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </section>
      <section id="interior" className="product-story section-pad">
        <Reveal>
          <p className="eyebrow muted">01 / {t.inside.toUpperCase()}</p>
          <div className="section-heading-row">
            <h2>{p.storyTitle}</h2>
            <p className="section-intro">{p.story}</p>
          </div>
        </Reveal>
        <Reveal className="product-interior">
          <Photo
            src={model === "f8" ? "interior" : "f11-interior"}
            alt={p.captions[0]}
          />
          <button className="button button-light" onClick={onInterior}>
            {t.view}
            <Arrow diagonal />
          </button>
        </Reveal>
        <div className="product-features">
          {p.features.map((feature, i) => (
            <div key={feature}>
              <span>0{i + 1}</span>
              <h3>{feature}</h3>
              <Arrow diagonal />
            </div>
          ))}
        </div>
      </section>
      <section id="specifications" className="product-engineering section-pad">
        <Reveal className="engineering-copy">
          <p className="eyebrow muted">02 / {t.specs.toUpperCase()}</p>
          <h2>{p.engineeringTitle}</h2>
          <p>{p.engineering}</p>
          <div className="engineering-image">
            <Photo
              src={model === "f8" ? "motor" : "f11-plan"}
              alt={
                model === "f8"
                  ? "FLYMAR electric direct drive"
                  : "FLYMAR F11 passenger layout"
              }
            />
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
            {t.contact}
            <Arrow diagonal />
          </button>
        </Reveal>
      </section>
      <section
        className="product-gallery section-pad"
        aria-roledescription={locale === "ru" ? "Карусель" : "Carousel"}
        aria-label={t.gallery}
      >
        <div className="product-gallery-heading">
          <h2>{t.gallery}</h2>
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
              transition={{ duration: reduced ? 0 : 0.45 }}
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
      <section className="product-next section-pad">
        <div>
          <p className="eyebrow muted">
            {locale === "ru" ? "ПРОДОЛЖИТЬ ЗНАКОМСТВО" : "CONTINUE EXPLORING"}
          </p>
          <h2>FLYMAR {other.toUpperCase()}</h2>
        </div>
        <Link href={modelHref(other, locale)} className="button button-dark">
          {fleetCopy[locale].details}
          <Arrow diagonal />
        </Link>
      </section>
    </>
  );
}
