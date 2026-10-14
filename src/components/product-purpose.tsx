import { Arrow, Photo, Reveal } from "./visual";
import { positioning } from "@/lib/positioning";
import type { Locale } from "@/lib/content";

export function EverydayMissions({
  locale,
  onContact,
}: {
  locale: Locale;
  onContact: () => void;
}) {
  const t = positioning[locale].missions;
  return (
    <section id="missions" className="everyday-missions section-pad">
      <Reveal>
        <p className="eyebrow muted">{t.label}</p>
        <div className="section-heading-row">
          <h2>{t.title}</h2>
          <p className="section-intro">{t.intro}</p>
        </div>
      </Reveal>
      <div className="mission-grid">
        {t.items.map((item, i) => (
          <Reveal className="mission-card" key={item.title}>
            <div className="mission-photo">
              <Photo src={item.image} alt={item.title} />
              <span className="micro-label">0{i + 1} / F8</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </Reveal>
        ))}
      </div>
      <div className="mission-uses">
        <p className="micro-label">{t.more}</p>
        <ul>
          {t.uses.map((use) => (
            <li key={use}>{use}</li>
          ))}
        </ul>
      </div>
      <Reveal className="ownership-brief">
        <h3>{t.ownership}</h3>
        <div>
          <p>{t.ownershipText}</p>
          <button className="text-link" onClick={onContact}>
            {positioning[locale].f8.contact}
            <Arrow diagonal />
          </button>
        </div>
      </Reveal>
    </section>
  );
}

export function TransitOperations({
  locale,
  onContact,
}: {
  locale: Locale;
  onContact: () => void;
}) {
  const t = positioning[locale].operations;
  return (
    <>
      <section id="operations" className="transit-operations section-pad">
        <Reveal>
          <p className="eyebrow muted">{t.label}</p>
          <div className="section-heading-row">
            <h2>{t.title}</h2>
            <p className="section-intro">{t.intro}</p>
          </div>
        </Reveal>
        <div className="network-panel">
          <div className="network-heading">
            <p className="micro-label">{t.network}</p>
            <span className="micro-label">F11 / NETWORK</span>
          </div>
          <ol className="network-stations">
            {t.stops.map((stop, i) => (
              <li key={stop}>
                <span className="station-index">0{i + 1}</span>
                <span className="station-dot" aria-hidden="true" />
                <strong>{stop}</strong>
              </li>
            ))}
          </ol>
          <p className="network-note">{t.schematic}</p>
        </div>
        <div className="operation-priorities">
          {t.priorities.map(([title, text], i) => (
            <div key={title}>
              <span className="micro-label">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="economics" className="operating-economics section-pad">
        <Reveal className="economics-heading">
          <p className="eyebrow muted">{t.economics}</p>
          <h2>{t.economicsTitle}</h2>
          <p>{t.economicsIntro}</p>
          <button className="button button-dark" onClick={onContact}>
            {positioning[locale].f11.contact}
            <Arrow diagonal />
          </button>
        </Reveal>
        <div className="cost-drivers">
          {t.costs.map(([title, text], i) => (
            <div key={title}>
              <span className="micro-label">0{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
          <p className="spec-note">{t.note}</p>
        </div>
      </section>
    </>
  );
}
