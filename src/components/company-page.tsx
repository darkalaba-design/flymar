"use client";
import Link from "next/link";
import { Arrow, Photo, Reveal } from "./visual";
import {
  companyCopy,
  companyDetails,
  companyHref,
  type CompanyPage as PageName,
} from "@/lib/company";
import type { Locale } from "@/lib/content";
import { track } from "@/lib/analytics";

export function CompanyPage({
  page,
  locale,
  onContact,
}: {
  page: PageName;
  locale: Locale;
  onContact: () => void;
}) {
  const copy = companyCopy[locale];
  if (page === "contacts") {
    const t = copy.contacts;
    return (
      <div className="company-page contacts-page">
        <section className="contacts-hero" id="top">
          <div className="contacts-intro">
            <p className="eyebrow muted">FLYMAR / {copy.labels.contacts}</p>
            <h1>{t.title}</h1>
            <p className="company-lead">{t.intro}</p>
            <div className="contacts-email">
              <span className="micro-label muted">{t.write}</span>
              <a
                href={`mailto:${companyDetails.email}`}
                onClick={() => track("cta_click", { source: "contacts-email" })}
              >
                {companyDetails.email}
                <Arrow diagonal />
              </a>
            </div>
            <button className="button button-dark" onClick={onContact}>
              {t.form}
              <Arrow diagonal />
            </button>
          </div>
          <div className="contacts-location">
            <Photo src="hero-city" alt={t.city} priority />
            <div className="contacts-location-top">
              <span className="status-dot" /> {t.city} / {t.country}
            </div>
            <div className="contacts-address">
              <p className="micro-label">{t.addressLabel}</p>
              <h2>{t.city}</h2>
              <p>{t.address}</p>
              <a
                className="text-link"
                href={companyDetails.map}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("cta_click", { source: "contacts-map" })}
              >
                {t.map}
                <Arrow diagonal />
              </a>
            </div>
          </div>
        </section>
        <section className="company-legal section-pad" id="company-details">
          <Reveal>
            <p className="eyebrow muted">
              01 / {locale === "ru" ? "ИНФОРМАЦИЯ" : "COMPANY INFORMATION"}
            </p>
            <h2>{t.legalTitle}</h2>
            <p className="legal-name">{t.legalName}</p>
          </Reveal>
          <Reveal>
            <dl>
              <div className="legal-address">
                <dt>{t.registered}</dt>
                <dd>{t.legalAddress}</dd>
              </div>
              {[
                [t.registration, companyDetails.ogrn],
                [t.tax, companyDetails.inn],
                [t.branch, companyDetails.kpp],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </section>
      </div>
    );
  }
  if (page === "technology") {
    const t = copy.technology;
    return (
      <div className="company-page technology-page">
        <section className="company-tech-hero" id="top">
          <Photo src="company-autonomy" alt={t.heroAlt} priority />
          <div className="company-tech-shade" />
          <div className="company-tech-hero-copy">
            <p className="eyebrow">FLYMAR / {copy.labels.technology}</p>
            <h1>{t.title}</h1>
            <p className="company-lead">{t.intro}</p>
          </div>
          <div className="company-tech-hero-bottom">
            <span className="micro-label">AUTONOMY FIRST</span>
            <a href="#principle" className="text-link">
              {locale === "ru" ? "В основе движения" : "Inside the technology"}
              <Arrow className="rotate-90" />
            </a>
          </div>
        </section>
        <section className="tech-principle section-pad" id="principle">
          <Reveal>
            <p className="eyebrow muted">01 / AUTONOMY FIRST</p>
            <h2>{t.principle}</h2>
          </Reveal>
          <Reveal>
            <p className="company-lead">{t.principleText}</p>
          </Reveal>
        </section>
        <nav
          className="tech-system-nav"
          aria-label={
            locale === "ru" ? "Направления технологий" : "Technology systems"
          }
        >
          {t.systems.map((s, i) => (
            <a href={`#${s.id}`} key={s.id}>
              <span>0{i + 1}</span>
              <strong>{s.label}</strong>
              <Arrow className="rotate-90" />
            </a>
          ))}
        </nav>
        <div className="tech-systems">
          {t.systems.map((s, i) => (
            <section
              className={`tech-system tech-system-${s.id}`}
              id={s.id}
              key={s.id}
            >
              <Reveal className="tech-system-visual">
                <Photo src={s.image} alt={s.alt} />
                <div className="tech-system-caption">
                  <span>FLYMAR / {s.label}</span>
                  <span>0{i + 1} — 04</span>
                </div>
              </Reveal>
              <Reveal className="tech-system-copy">
                <p className="eyebrow muted">
                  0{i + 2} / {s.label}
                </p>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
                <ul>
                  {s.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </Reveal>
            </section>
          ))}
        </div>
        <section className="tech-collection section-pad">
          <Reveal>
            <p className="eyebrow muted">{t.architecture}</p>
            <h2>{t.collectionTitle}</h2>
          </Reveal>
          <Reveal>
            <p>{t.collectionText}</p>
            <Link
              className="text-link"
              href={`${locale === "ru" ? "/ru" : "/"}#vessel`}
            >
              {t.collectionLink}
              <Arrow diagonal />
            </Link>
          </Reveal>
        </section>
      </div>
    );
  }
  const t = copy.about;
  return (
    <div className="company-page about-page">
      <section className="company-about-hero" id="top">
        <div className="company-about-intro">
          <p className="eyebrow muted">FLYMAR / {copy.labels.about}</p>
          <h1>{t.title}</h1>
          <p className="company-lead">{t.intro}</p>
          <div className="company-origin">
            <strong>2025</strong>
            <span>{t.origin}</span>
          </div>
        </div>
        <figure className="company-team">
          <div>
            <Photo src="company-team" alt={t.imageAlt} priority />
          </div>
          <figcaption>
            {t.caption}
            <span>FLYMAR / R&amp;D</span>
          </figcaption>
        </figure>
      </section>
      <section className="company-story section-pad" id="our-story">
        <Reveal>
          <p className="eyebrow muted">
            01 / {locale === "ru" ? "НАШ ПОДХОД" : "OUR APPROACH"}
          </p>
          <h2>{t.storyTitle}</h2>
        </Reveal>
        <Reveal>
          {t.story.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <Link href={companyHref("technology", locale)} className="text-link">
            {t.link}
            <Arrow diagonal />
          </Link>
        </Reveal>
      </section>
      <section className="company-statement" id="full-stack">
        <Photo
          src="hero-open-water"
          alt={
            locale === "ru"
              ? "Электрическое судно FLYMAR на воде"
              : "FLYMAR electric vessel on the water"
          }
        />
        <div className="company-statement-shade" />
        <Reveal>
          <p className="eyebrow">{t.fullStack}</p>
          <h2>{t.statement}</h2>
          <p>{t.statementText}</p>
        </Reveal>
        <span className="micro-label company-statement-caption">
          FLYMAR / FULL STACK COMPANY
        </span>
      </section>
      <section className="company-expertise section-pad" id="team">
        <Reveal className="company-expertise-heading">
          <div>
            <p className="eyebrow muted">
              02 / {locale === "ru" ? "ЭКСПЕРТИЗА" : "OUR EXPERTISE"}
            </p>
            <h2>{t.expertiseTitle}</h2>
          </div>
          <p className="company-lead">{t.expertiseIntro}</p>
        </Reveal>
        <div className="company-expertise-grid">
          {t.expertise.map(([title, text], i) => (
            <Reveal key={title}>
              <span className="expertise-number">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
