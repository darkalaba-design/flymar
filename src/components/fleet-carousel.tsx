"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { Arrow, Photo, Reveal } from "./visual";
import { fleet, fleetCopy, modelHref, type ModelId } from "@/lib/fleet";
import type { Locale } from "@/lib/content";
import { track } from "@/lib/analytics";

export function FleetCarousel({
  locale,
  onContact,
}: {
  locale: Locale;
  onContact: (source: string) => void;
}) {
  const t = fleetCopy[locale];
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  function go(index: number) {
    const next = Math.max(0, Math.min(fleet.length - 1, index));
    const card = rail.current?.children[next] as HTMLElement | undefined;
    if (card && rail.current)
      rail.current.scrollTo({
        left:
          card.offsetLeft -
          (rail.current.children[0] as HTMLElement).offsetLeft,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    track("cta_click", { source: "fleet_change", model: fleet[next] });
  }
  return (
    <section
      id="vessel"
      className="fleet-section section-pad"
      aria-roledescription={locale === "ru" ? "Карусель" : "Carousel"}
      aria-label={locale === "ru" ? "Модели FLYMAR" : "FLYMAR vessels"}
    >
      <Reveal>
        <p className="eyebrow muted">{t.label}</p>
        <div className="section-heading-row">
          <h2>{t.title}</h2>
          <div className="fleet-heading-side">
            <p className="section-intro">{t.intro}</p>
            <div className="fleet-controls">
              <span className="micro-label" aria-live="polite">
                0{active + 1} / 04
              </span>
            </div>
          </div>
        </div>
      </Reveal>
      <div
        className="fleet-tabs"
        aria-label={locale === "ru" ? "Выбор модели" : "Choose a model"}
      >
        {fleet.map((model, i) => (
          <button key={model} onClick={() => go(i)} aria-pressed={active === i}>
            FLYMAR {model.toUpperCase()}
            <span>0{i + 1}</span>
          </button>
        ))}
      </div>
      <div className="fleet-carousel">
        <div
          id="fleet-rail"
          className="fleet-rail"
          ref={rail}
          tabIndex={0}
          aria-label={
            locale === "ru"
              ? "Сдвиньте для просмотра моделей"
              : "Scroll to explore the vessels"
          }
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              go(active + (event.key === "ArrowRight" ? 1 : -1));
            }
          }}
          onScroll={() => {
            const el = rail.current;
            if (!el) return;
            const children = [...el.children] as HTMLElement[];
            const first = children[0].offsetLeft;
            const distances = children.map((card) =>
              Math.abs(card.offsetLeft - first - el.scrollLeft),
            );
            setActive(distances.indexOf(Math.min(...distances)));
          }}
        >
          {fleet.map((id, index) => {
            const model = t[id];
            const detailed = id === "f8" || id === "f11";
            return (
              <article
                className={`fleet-card fleet-${id}`}
                key={id}
                aria-label={`FLYMAR ${id.toUpperCase()}`}
              >
                <div
                  className={`fleet-image ${!detailed ? "fleet-placeholder" : ""}`}
                >
                  {detailed ? (
                    <Photo
                      src={id === "f8" ? "vessel" : "f11-profile"}
                      alt={`FLYMAR ${id.toUpperCase()}`}
                    />
                  ) : (
                    <>
                      <span className="placeholder-orbit" aria-hidden="true" />
                      <span className="placeholder-model" aria-hidden="true">
                        {id.toUpperCase()}
                      </span>
                      <span className="placeholder-caption">{t.preview}</span>
                    </>
                  )}
                  <span className="fleet-card-index">
                    0{index + 1} / FLYMAR COLLECTION
                  </span>
                </div>
                <div className="fleet-card-copy">
                  <div className="fleet-title-row">
                    <h3>
                      FLYMAR <span>{id.toUpperCase()}</span>
                    </h3>
                    <span className="micro-label">{model.title}</span>
                  </div>
                  <p>{model.description}</p>
                  <div className="fleet-stats">
                    {model.stats.map(([value, label]) => (
                      <div key={label}>
                        <strong>{value}</strong>
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="fleet-links">
                    <button
                      className="button button-dark"
                      onClick={() => onContact(`fleet-${id}`)}
                    >
                      {t.enquire}
                      <Arrow diagonal />
                    </button>
                    {detailed ? (
                      <Link
                        href={modelHref(id as ModelId, locale)}
                        className="text-link"
                      >
                        {t.details}
                        <Arrow diagonal />
                      </Link>
                    ) : (
                      <span className="coming-soon">{t.coming}</span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="fleet-card-controls">
          <button
            className="circle-button"
            onClick={() => go(active - 1)}
            disabled={active === 0}
            aria-label={t.previous}
            aria-controls="fleet-rail"
          >
            <Arrow className="rotate-180" />
          </button>
          <button
            className="circle-button"
            onClick={() => go(active + 1)}
            disabled={active === fleet.length - 1}
            aria-label={t.next}
            aria-controls="fleet-rail"
          >
            <Arrow />
          </button>
        </div>
      </div>
    </section>
  );
}
