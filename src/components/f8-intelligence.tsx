import type { CSSProperties } from "react";
import type { Locale } from "@/lib/content";
import { Reveal } from "./visual";
import styles from "./f8-intelligence.module.css";

export function F8Intelligence({ locale }: { locale: Locale }) {
  const ru = locale === "ru";
  const labels = ru
    ? ["Цифровое управление", "Активная стабилизация", "Подключённый флот", "Интеллектуальная навигация", "Восприятие с помощью ИИ"]
    : ["Digital control", "Active flight stabilization", "Connected fleet", "Intelligent navigation", "AI perception"];
  return (
    <section id="intelligence" className={`section-pad ${styles.section}`}>
      <Reveal className={styles.heading}>
        <p className="eyebrow muted">04 / FLYMAR INTELLIGENCE</p>
        <h2>{ru ? "Интеллект в каждой миле" : "Intelligence in Every Mile"}</h2>
        <p className={styles.intro}>{ru
          ? "Полностью цифровое управление, активная стабилизация и восприятие с помощью ИИ — интегрированы в единую систему."
          : "Fully digital control, active flight stabilization, and AI perception—integrated natively"}</p>
      </Reveal>
      <div className={styles.grid}>
        {labels.map((label, index) => (
          <Reveal className={styles.item} key={label}>
            <span aria-hidden="true" className={styles.icon} style={{ "--icon-url": `url(/media/intelligence-${index + 1}.svg)` } as CSSProperties} />
            <h3>{label}</h3>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
