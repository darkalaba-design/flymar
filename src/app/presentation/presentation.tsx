"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { productCopy } from "@/lib/fleet";
import styles from "./presentation.module.css";

const titles = ["What we do", "Why hydrofoils", "What we do differently", "F8 & F11", "Target specifications"];

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
      if (event.key === "End") { event.preventDefault(); go(4); }
      if (/^[1-5]$/.test(event.key)) go(Number(event.key) - 1);
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
                <span>{title}</span>
              </header>

              {index === 0 && <>
                <Photo name="application-city" alt="FLYMAR electric vessels at a neutral city waterfront" className={styles.hero} />
                <div className={styles.heroShade} />
                <div className={styles.coverCopy}>
                  <p className={styles.eyebrow}>ELECTRIC HYDROFOILS</p>
                  <h1>High-speed travel.<br />Above the water.</h1>
                  <p className={styles.intro}>Efficient waterborne transport, engineered<br />around passenger comfort and digital control.</p>
                </div>
                <div className={styles.coverBenefits}>
                  <div><b>Commercial efficiency</b><span>Lower energy and maintenance needs</span></div>
                  <div><b>Simple infrastructure</b><span>Landing access and electric charging</span></div>
                  <div><b>Digital DNA</b><span>Software at the core of the vessel</span></div>
                </div>
              </>}

              {index === 1 && <>
                <div className={styles.whyCopy}>
                  <p className={styles.eyebrow}>THE CASE FOR ELECTRIC FOILING</p>
                  <h2>Less resistance.<br />More possibility.</h2>
                  <p className={styles.intro}>Hydrofoils lift the hull clear of the water.<br />Lower drag makes electric speed practical.</p>
                  <div className={styles.reason}><b>Low wake</b><p>Less disturbance along urban waterfronts.</p></div>
                  <div className={styles.reason}><b>Lower energy demand</b><p>Less resistance at cruising speed.</p></div>
                  <div className={styles.reason}><b>A smoother journey</b><p>Active foil control helps keep the vessel stable.</p></div>
                </div>
                <Photo name="company-foils" alt="FLYMAR hydrofoil engineering" className={styles.whyImage} />
                <div className={styles.imageCaption}>Electric propulsion + actively controlled hydrofoils</div>
              </>}

              {index === 2 && <>
                <div className={styles.automationCopy}>
                  <p className={styles.eyebrow}>OUR AUTOMATION ADVANTAGE</p>
                  <h2>Autonomy First</h2>
                  <p className={styles.automationLead}>Software-defined vessel</p>
                  <p className={styles.intro}>We develop the intelligence and the core control<br />systems together, from the start.</p>
                  <div className={styles.automationRows}>
                    <div><span>01</span><p><b>Understand the environment</b>Computer vision and sensors for situational awareness.</p></div>
                    <div><span>02</span><p><b>Control the vessel</b>In-house electronics, drive by wire and active foils.</p></div>
                    <div><span>03</span><p><b>Connect to operations</b>Remote operation from shore. Digital integration with the external environment is a design priority.</p></div>
                  </div>
                </div>
                <Photo name="autonomy-fleet-control" alt="FLYMAR concept for connected vessel and fleet control" className={styles.automationImage} />
                <p className={styles.automationFoot}>Automation is part of the architecture of both F8 and F11.</p>
              </>}

              {index === 3 && <>
                <div className={styles.modelsTitle}><p className={styles.eyebrow}>ONE TECHNOLOGY PLATFORM</p><h2>Two vessels. Different missions.</h2></div>
                <div className={styles.models}>
                  <article><Photo name="f8-main" alt="FLYMAR F8 electric hydrofoil" /><div className={styles.modelHeading}><h3>F8</h3><span>VERSATILE SHUTTLE</span></div><h4>One vessel, many applications</h4><p>Resort transfers, private journeys and local passenger services. A flexible platform for everyday operation.</p></article>
                  <article><Photo name="f11-hero" alt="FLYMAR F11 commercial hydrofoil concept" /><div className={styles.modelHeading}><h3>F11</h3><span>COMMERCIAL TRANSIT</span></div><h4>Designed for transport economics</h4><p>A dedicated platform for cities and fleet operators, with passenger flow and fleet deployment at its core.</p></article>
                </div>
              </>}

              {index === 4 && <>
                <div className={styles.specsTitle}><p className={styles.eyebrow}>PERFORMANCE & OPERATING BRIEF</p><h2>Target specifications</h2></div>
                <div className={styles.specColumns}>
                  <article><div className={styles.specHeading}><h3>F8</h3><span>Current published specifications</span></div>
                    <dl className={styles.numbers}>{productCopy.en.f8.specifications.slice(0, 3).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
                    <dl className={styles.specDetails}>{productCopy.en.f8.specifications.slice(3).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
                    <p className={styles.specNote}>{productCopy.en.f8.note}</p>
                  </article>
                  <article><div className={styles.specHeading}><h3>F11</h3><span>Commercial platform in development</span></div>
                    <div className={styles.f11Brief}><h4>Built around the route</h4><p>Capacity and cabin layout</p><p>Service speed and route range</p><p>Charging and turnaround</p><p>Fleet operation and lifecycle cost</p></div>
                    <p className={styles.specNote}>F11 technical specifications will be shared at launch. These are design priorities, not confirmed performance figures.</p>
                  </article>
                </div>
                <a className={styles.contact} href="mailto:hello@flymar.tech">Let’s discuss your route <span>hello@flymar.tech</span></a>
              </>}
              <footer className={styles.slideFooter}><span>FLYMAR / Electric water mobility</span><span>{String(index + 1).padStart(2, "0")} / 05</span></footer>
            </section>
          ))}
        </div>
      </div>
      <nav className={styles.controls} aria-label="Presentation controls">
        <a href="/" className={styles.back}>← Website</a>
        <div className={styles.pagination}>
          <button onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous slide">←</button>
          {titles.map((title, index) => <button key={title} aria-label={`Slide ${index + 1}: ${title}`} aria-current={active === index ? "step" : undefined} onClick={() => go(index)} className={styles.dot}>{String(index + 1).padStart(2, "0")}</button>)}
          <button onClick={() => go(active + 1)} disabled={active === 4} aria-label="Next slide">→</button>
        </div>
        <button onClick={() => void toggleFullscreen()} aria-label={fullscreen ? "Exit full screen" : "Full screen"}>{fullscreen ? "Exit full screen" : "Full screen ↗"}</button>
      </nav>
      <p className={styles.hint}>← → to navigate <span>F for full screen</span></p>
      <p className={styles.srOnly} aria-live="polite">Slide {active + 1} of 5: {titles[active]}. {notice}</p>
    </main>
  );
}
