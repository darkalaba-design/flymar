import type { CSSProperties } from "react";
import type { Locale } from "@/lib/content";
import { Reveal } from "./visual";
import styles from "./f8-intelligence.module.css";

export function F8Intelligence({ locale }: { locale: Locale }) {
  const ru = locale === "ru";
  const icons = [4, 2, 5, 1, 3];
  const items = ru
    ? [
        ["Drive-by-Wire", "Полностью цифровая архитектура рулевого управления и тяги для мгновенного отклика на команды капитана."],
        ["Активная стабилизация подводных крыльев", "Динамическая регулировка подводных крыльев за миллисекунды обеспечивает плавный устойчивый ход, отсутствие кильватерной волны и максимальную эффективность."],
        ["Компьютерное зрение", "Обнаружение опасностей с помощью ИИ и сканирование окружающей среды в реальном времени для активного предотвращения столкновений."],
        ["Цифровое управление судном", "Единый интерфейс в рубке объединяет навигацию, диагностику в реальном времени и управление системами."],
        ["Удалённая связь с флотом", "Беспроводной мониторинг, отслеживание телеметрии и безопасное перемещение судов без экипажа."],
      ]
    : [
        ["Drive-by-Wire", "Fully digital steering and throttle architecture for instantaneous helm response."],
        ["Active Foil Stabilization", "Dynamic hydrofoil adjustments in milliseconds for seamless stability, zero wake, and maximum efficiency."],
        ["Computer Vision Perception", "Real-time AI hazard detection and environmental scanning for active collision avoidance."],
        ["Digital Vessel Management", "A unified cockpit interface integrating navigation, live diagnostics, and systems control."],
        ["Remote Fleet Connectivity", "Over-the-air monitoring, telemetry tracking, and secure uncrewed repositioning."],
      ];
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
        {items.map(([label, description], index) => (
          <Reveal className={styles.item} key={label}>
            <span aria-hidden="true" className={styles.icon} style={{ "--icon-url": `url(/media/intelligence-${icons[index]}.svg)` } as CSSProperties} />
            <h3>{label}</h3>
            <p>{description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
