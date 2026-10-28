"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./presentation.module.css";

const titles = ["What we do", "Why hydrofoils", "What we do differently", "F8 & F11", "Target specifications", "Let’s connect"];
const f8Targets = [
  ["Max Capacity", "10 passengers + 1 Crew"],
  ["Range", "45 NM"],
  ["Max Speed", "30 knots"],
  ["Cruise Speed", "25 knots"],
  ["Motor", "2 × 50 kW"],
  ["Charging", "Shore Power & DC Fast Charging"],
  ["Battery Capacity", "80 kWh or 120 kWh"],
];

function Photo({ name, alt, className = "" }: { name: string; alt: string; className?: string }) {
  // Original site assets stay full-resolution for presentation and print.
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={`${styles.photo} ${className}`} src={`/media/${name}.webp`} alt={alt} />;
}

export function Presentation() {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [notice, setNotice] = useState("");
  const root = useRef<HTMLElement>(null);
  const touch = useRef<number | null>(null);
  const go = useCallback((index: number) => {
    const next = Math.max(0, Math.min(titles.length - 1, index));
    setActive(next);
    history.replaceState(null, "", `#${next + 1}`);
  }, []);

  useEffect(() => {
    const readHash = () => {
      const index = Number(location.hash.slice(1));
      if (Number.isInteger(index) && index >= 1 && index <= titles.length) setActive(index - 1);
    };
    readHash();
    const syncFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));
    window.addEventListener("hashchange", readHash);
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => {
      window.removeEventListener("hashchange", readHash);
      document.removeEventListener("fullscreenchange", syncFullscreen);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await root.current?.requestFullscreen();
    } catch { setNotice("Use your browser’s full-screen command to present."); }
  }, []);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || (event.target instanceof Element && event.target.closest("button, a, input, textarea, select"))) return;
      if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key)) { event.preventDefault(); go(active + 1); }
      if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) { event.preventDefault(); go(active - 1); }
      if (event.key === "Home") { event.preventDefault(); go(0); }
      if (event.key === "End") { event.preventDefault(); go(titles.length - 1); }
      if (/^[1-9]$/.test(event.key) && Number(event.key) <= titles.length) go(Number(event.key) - 1);
      if (event.key.toLowerCase() === "f") { event.preventDefault(); void toggleFullscreen(); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [active, go, toggleFullscreen]);

  return (
    <main ref={root} className={styles.presentation}>
      <div className={styles.stage} onTouchStart={(event) => { touch.current = event.touches[0].clientX; }} onTouchEnd={(event) => {
        if (touch.current !== null) {
          const delta = event.changedTouches[0].clientX - touch.current;
          if (Math.abs(delta) > 50) go(active + (delta < 0 ? 1 : -1));
        }
        touch.current = null;
      }}>
        <div className={styles.canvas}>
          {titles.map((title, index) => (
            <section key={title} className={`${styles.slide} ${styles[`slide${index + 1}`]} ${index === active ? styles.active : ""}`} aria-label={`${index + 1}. ${title}`} aria-hidden={index !== active}>
              <header className={styles.slideHeader}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/logo.svg" width="156" height="35" alt="FLYMAR" className={styles.logo} />
              </header>

              {index === 0 && <>
                <div className={styles.coverPhotos}>
                  <Photo name="f8-inside-open" alt="FLYMAR F8 cutaway showing the passenger cabin" />
                  <Photo name="presentation-f8-exterior-cutout" alt="FLYMAR F8 exterior viewed from above" />
                </div>
                <div className={styles.coverCopy}>
                  <h1>We build next-generation<br />electric hydrofoil fleets</h1>
                </div>
                <div className={styles.coverBenefits}>
                  <div><h3>High-Speed Efficiency:</h3><p><strong>30+ knots</strong> with <strong>80% less energy</strong> consumed per nautical mile.</p></div>
                  <div><h3>Low-OPEX Comfort:</h3><p><strong>90% less wave impact</strong> and <strong>up to 70% lower</strong> lifecycle operating costs.</p></div>
                  <div><h3>Minimal Infrastructure:</h3><p><strong>Zero wake</strong> at speed; operates directly from standard floating pontoons.</p></div>
                  <div><h3>Software-Defined Mobility:</h3><p><strong>100% digital architecture</strong> ready for remote transit and autonomous dispatch.</p></div>
                </div>
              </>}

              {index === 1 && <>
                <Photo name="presentation-waterfront" alt="FLYMAR F8 waterfront view" className={styles.hero} />
                <div className={styles.heroShade} />
                <div className={styles.whyCopy}>
                  <h2>The Inevitable Future<br />of Water mobility</h2>
                  <div className={styles.reason}>The only way for high-speed city commute (no wake) and electric propulsion (low&nbsp;drag)</div>
                  <div className={styles.reason}>Bypasses saturated land transit with zero road or rail CAPEX</div>
                  <div className={styles.reason}>Radically lower unit economics and total decarbonization</div>
                </div>
              </>}

              {index === 2 && <>
                <div className={styles.technologyTitle}>
                  <h2><span>What We Do Differently:</span>Software-Defined Vessels</h2>
                </div>
                <div className={styles.technologyColumns}>
                  <article>
                    <Photo name="navigation-sensor-cutout" alt="FLYMAR navigation sensor unit on a transparent background" />
                    <h3>Autonomy First — Built Around Software &amp; Sensors</h3>
                    <p>Unlike traditional shipyards that add electronics as an afterthought, we design intelligence first and build the vessel around it. Computer vision and multi-sensor suites provide total situational awareness natively.</p>
                  </article>
                  <article>
                    <Photo name="control-unit" alt="FLYMAR proprietary control unit" />
                    <h3>FLYMAR Control Unit — In-House Digital Architecture</h3>
                    <p>Proprietary core electronics eliminate third-party black boxes. Full drive-by-wire controls enable real-time agility and seamless remote operation from shore or autonomous repositioning.</p>
                  </article>
                  <article>
                    <Photo name="wings" alt="FLYMAR active hydrofoil flight control surfaces" />
                    <h3>Intelligent Flight Control &amp; Direct E-Drive</h3>
                    <p>Millisecond dynamic foil adjustments ensure maximum efficiency and an unshakable ride, paired with an in-house underwater direct-drive electric propulsion unit with minimal moving parts for radically lower maintenance.</p>
                  </article>
                </div>
              </>}

              {index === 3 && <>
                <div className={styles.models}>
                  <article>
                    <h3>FLYMAR F8</h3>
                    <Photo name="presentation-f8" alt="FLYMAR F8 electric hydrofoil" />
                    <p>All-electric, 10-passenger hydrofoil shuttle engineered for high-frequency urban transit and luxury resort connectivity.</p>
                    <dl className={styles.modelStats}>
                      <div><dd>10</dd><dt>passengers capacity</dt></div>
                      <div><dd>22</dd><dt>knots cruise</dt></div>
                      <div><dd>40</dd><dt>NM range</dt></div>
                    </dl>
                  </article>
                  <article>
                    <h3>FLYMAR F11</h3>
                    <Photo name="presentation-f11" alt="FLYMAR F11 commercial hydrofoil concept" />
                    <p>Designed to move people profitably. A commercial transit platform in development for cities, transport authorities and fleet operators.</p>
                    <div className={styles.comingSoon}>Coming in <strong>2027</strong></div>
                  </article>
                </div>
              </>}

              {index === 4 && <>
                <div className={styles.specsTitle}><h2>Target specifications<br />of FLYMAR F8</h2></div>
                <dl className={styles.targetSpecs}>
                  {f8Targets.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
                </dl>
                <Photo name="presentation-f8-profile" alt="FLYMAR F8 side profile showing its hydrofoils and electric propulsion" className={styles.targetImage} />
              </>}

              {index === 5 && <>
                <Photo name="presentation-connect" alt="FLYMAR F8 approaching over the water" className={styles.connectImage} />
                <div className={styles.connectCopy}>
                  <h2>Let’s connect</h2>
                  <p>Dmitry Filatov</p>
                  <a href="mailto:d.filatov@flymar.tech">d.filatov@flymar.tech</a>
                </div>
              </>}
              <footer className={styles.slideFooter}><span>{String(index + 1).padStart(2, "0")} / {String(titles.length).padStart(2, "0")}</span></footer>
            </section>
          ))}
        </div>
      </div>
      <nav className={styles.controls} aria-label="Presentation controls">
        <a href="/" className={styles.back}>← Website</a>
        <div className={styles.pagination}>
          <button onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous slide">←</button>
          {titles.map((title, index) => <button key={title} aria-label={`Slide ${index + 1}: ${title}`} aria-current={active === index ? "step" : undefined} onClick={() => go(index)} className={styles.dot}>{String(index + 1).padStart(2, "0")}</button>)}
          <button onClick={() => go(active + 1)} disabled={active === titles.length - 1} aria-label="Next slide">→</button>
        </div>
        <div className={styles.actions}>
          <a href="/downloads/flymar-presentation.pdf" download="FLYMAR-Presentation.pdf">Download PDF ↓</a>
          <button onClick={() => void toggleFullscreen()} aria-label={fullscreen ? "Exit full screen" : "Full screen"}>{fullscreen ? "Exit full screen" : "Full screen ↗"}</button>
        </div>
      </nav>
      <p className={styles.hint}>← → to navigate <span>F for full screen</span></p>
      <p className={styles.srOnly} aria-live="polite">Slide {active + 1} of {titles.length}: {titles[active]}. {notice}</p>
    </main>
  );
}
