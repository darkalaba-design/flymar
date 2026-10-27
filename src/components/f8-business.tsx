import type { Locale } from "@/lib/content";
import { Photo, Reveal } from "./visual";

const copy = {
  en: {
    title: "F8 will bring efficiency and flexibility to your water mobility business",
    items: [
      ["Lower operating costs", "By cutting hydrodynamic drag up to 80%, electric hydrofoils eliminate diesel maintenance and slash fuel costs, radically boosting profit per passenger-mile."],
      ["Maximum uptime", "Rapid 30-minute charging recovers up to 70 miles of range—maximizing daily uptime and keeping your fleet on schedule."],
      ["On-demand autonomy", "On-demand autonomy delivers more efficient routes with active pilot-assist and lets you reposition vessels between points with no crew on board."],
    ],
  },
  ru: {
    title: "F8 — эффективность и гибкость для вашего бизнеса на воде",
    items: [
      ["Ниже эксплуатационные расходы", "Снижая гидродинамическое сопротивление до 80%, электрические суда на подводных крыльях избавляют от обслуживания дизеля и резко сокращают затраты на топливо, существенно увеличивая прибыль на пассажиро-милю."],
      ["Больше времени на маршруте", "Быстрая 30-минутная зарядка восстанавливает до 70 миль запаса хода — максимум рабочего времени каждый день и движение флота по расписанию."],
      ["Автономность по запросу", "Автономность по запросу повышает эффективность маршрутов благодаря активной помощи капитану и позволяет перемещать суда между точками без экипажа на борту."],
    ],
  },
};
const images = ["hero-opex", "f8-boarding", "f8-cockpit"];

export function F8Business({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <section id="missions" className="everyday-missions section-pad">
      <Reveal><p className="eyebrow muted">03 / FLYMAR FOR BUSINESS</p><h2>{t.title}</h2></Reveal>
      <div className="mission-grid">
        {t.items.map(([title, text], i) => (
          <Reveal className="mission-card" key={title}>
            <div className="mission-photo"><Photo src={images[i]} alt={title} /></div>
            <h3>{title}</h3><p>{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
