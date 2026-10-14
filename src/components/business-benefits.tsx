import type { CSSProperties } from "react";
import type { Locale } from "@/lib/content";
import { Arrow, Reveal } from "./visual";
import styles from "./business-benefits.module.css";

type Icon =
  "monitor" | "telemetry" | "service" | "electricity" | "foil" | "savings";

const iconFiles: Record<Icon, string> = {
  monitor: "a1",
  telemetry: "a2",
  service: "a3",
  electricity: "b1",
  foil: "b2",
  savings: "b3",
};

export function BenefitIcon({ name }: { name: Icon }) {
  return (
    <span
      className={styles.icon}
      style={
        {
          "--icon-url": `url(/media/benefit-${iconFiles[name]}.svg)`,
        } as CSSProperties
      }
      aria-hidden="true"
    />
  );
}

const copy = {
  en: {
    title: "Manage Your Fleet",
    intro:
      "Flymar for Business is our integrated fleet management platform that allows you to manage and monitor vessels remotely.",
    link: "Learn more about Flymar for Business",
    economics: "The advantages of electric hydrofoils",
    management: [
      {
        icon: "monitor",
        title: "Monitor Vessels",
        text: "Manage skipper access, oversee passenger routes, and track the live GPS locations of your active fleet.",
      },
      {
        icon: "telemetry",
        title: "View Telemetry",
        text: "Access real-time vessel data including battery state of charge, foil flight trim, energy efficiency and more.",
      },
      {
        icon: "service",
        title: "Schedule Service",
        text: "Schedule routine maintenance, monitor drivetrain health, and manage service estimates and technical inspection logs.",
      },
    ],
    savings: [
      {
        icon: "electricity",
        title: "Electricity Costs Less Than Diesel",
        text: "Charging with electricity typically costs significantly less than refueling with marine diesel while delivering plenty of range, particularly when paired with high-efficiency hydrofoils.",
      },
      {
        icon: "foil",
        title: "Electric Foilers Need Less Maintenance",
        text: "With fewer moving parts, no diesel engine, and no complex marine transmission or exhaust systems, our fully electric hydrofoils need far less maintenance than a traditional diesel boat.",
      },
      {
        icon: "savings",
        title: "Incentives Add Savings",
        text: "Depending on where you operate your passenger fleet, you may be eligible for local green maritime subsidies and incentives. Leasing and financing options are also available.",
      },
    ],
  },
  ru: {
    title: "Управляйте своим флотом",
    intro:
      "Flymar for Business — наша единая платформа для управления флотом и удалённого контроля судов.",
    link: "Подробнее о Flymar for Business",
    economics: "Преимущества электрических судов на подводных крыльях",
    management: [
      {
        icon: "monitor",
        title: "Контроль судов",
        text: "Управляйте доступом капитанов, контролируйте пассажирские маршруты и отслеживайте местоположение судов вашего флота по GPS в реальном времени.",
      },
      {
        icon: "telemetry",
        title: "Телеметрия",
        text: "Получайте данные о судне в реальном времени: уровень заряда батареи, дифферент при движении на крыльях, энергоэффективность и другие показатели.",
      },
      {
        icon: "service",
        title: "Планирование сервиса",
        text: "Планируйте регулярное обслуживание, следите за состоянием силовой установки, управляйте сметами на сервис и журналами технических осмотров.",
      },
    ],
    savings: [
      {
        icon: "electricity",
        title: "Электричество дешевле дизеля",
        text: "Зарядка электричеством обычно обходится значительно дешевле заправки судовым дизелем и обеспечивает большой запас хода — особенно в сочетании с высокоэффективными подводными крыльями.",
      },
      {
        icon: "foil",
        title: "Меньше затрат на обслуживание",
        text: "Меньше движущихся частей, отсутствие дизельного двигателя, сложной судовой трансмиссии и выхлопной системы — нашим полностью электрическим судам на подводных крыльях требуется гораздо меньше обслуживания, чем традиционным дизельным.",
      },
      {
        icon: "savings",
        title: "Дополнительная экономия с программами поддержки",
        text: "В зависимости от региона работы вашего пассажирского флота вам могут быть доступны местные субсидии и программы поддержки экологичного водного транспорта. Также доступны лизинг и финансирование.",
      },
    ],
  },
} satisfies Record<
  Locale,
  {
    title: string;
    intro: string;
    link: string;
    economics: string;
    management: { icon: Icon; title: string; text: string }[];
    savings: { icon: Icon; title: string; text: string }[];
  }
>;

export function BusinessBenefits({
  locale,
  variant,
  onContact,
}: {
  locale: Locale;
  variant: "management" | "savings";
  onContact?: () => void;
}) {
  const t = copy[locale];
  return (
    <section
      className={`section-pad ${styles.section} ${variant === "savings" ? styles.economics : ""}`}
      aria-label={variant === "management" ? t.title : t.economics}
    >
      {variant === "management" && (
        <Reveal className={styles.heading}>
          <h2>{t.title}</h2>
          <div>
            <p>{t.intro}</p>
            <button className={`text-link ${styles.link}`} onClick={onContact}>
              {t.link}
              <Arrow diagonal />
            </button>
          </div>
        </Reveal>
      )}
      <div className={styles.grid}>
        {t[variant].map((item) => (
          <Reveal key={item.icon} className={styles.card}>
            <BenefitIcon name={item.icon} />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
