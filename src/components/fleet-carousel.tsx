"use client";
import Link from "next/link";
import { useSiteTheme } from "./theme-provider";
import { useRef, useState } from "react";
import { Arrow, Photo } from "./visual";
import { fleet, fleetCopy, modelHref } from "@/lib/fleet";
import type { Locale } from "@/lib/content";
import { track } from "@/lib/analytics";

export function FleetCarousel({
  locale,
  onContact,
}: {
  locale: Locale;
  onContact: (source: string) => void;
}) {
  const theme = useSiteTheme();
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
        behavior:
          theme.motion === 0 ||
          matchMedia("(prefers-reduced-motion: reduce)").matches
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
            return (
              <article
                className={`fleet-card fleet-${id}`}
                key={id}
                aria-label={`FLYMAR ${id.toUpperCase()}`}
              >
                <div className="fleet-image">
                  <Photo
                    src={id === "f8" ? "leisure" : "f11-interior"}
                    alt={`FLYMAR ${id.toUpperCase()}`}
                  />
                  <span className="fleet-card-index">
                    0{index + 1} / FLYMAR COLLECTION
                  </span>
                </div>
                <div className="fleet-card-copy">
                  <div className="fleet-title-row">
                    <h3>
                      FLYMAR <span>{id.toUpperCase()}</span>
                    </h3>
                  </div>
                  <p>{model.description}</p>
                  {id === "f11" ? (
                    <div className="fleet-launch">
                      <span className="product-launch-status">
                        <span />
                        Coming Soon
                      </span>
                      <p>
                        {locale === "ru"
                          ? "В разработке. Открыт диалог с операторами и транспортными партнёрами."
                          : "In development. Open to conversations with operators and transit partners."}
                      </p>
                    </div>
                  ) : (
                    <div className="fleet-stats">
                      {model.stats.map(([value, label]) => (
                        <div key={label}>
                          <strong>{value}</strong>
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="fleet-links">
                    <button
                      className="button button-dark"
                      onClick={() => onContact(`fleet-${id}`)}
                    >
                      {t.enquire}
                      <Arrow diagonal />
                    </button>
                    <Link href={modelHref(id, locale)} className="text-link">
                      {t.details}
                      <Arrow diagonal />
                    </Link>
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
