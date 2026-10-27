import type { Locale } from "./content";

export const fleet = ["f8", "f11"] as const;
export type ModelId = (typeof fleet)[number];
export type FleetId = (typeof fleet)[number];
export function modelHref(model: ModelId, locale: Locale) {
  return `${locale === "ru" ? "/ru" : ""}/models/${model}`;
}
export const fleetCopy = {
  en: {
    label: "02 / THE FLYMAR COLLECTION",
    title: "Find your way\nabove the water.",
    intro:
      "One technology platform. Two distinct purposes. Everyday freedom with F8. Commercial transit with F11.",
    previous: "Previous vessel",
    next: "Next vessel",
    enquire: "Get in touch",
    details: "Explore the model",
    f8: {
      title: "The Everyday Electric Hydrofoil",
      description:
        "One vessel. Endless missions. An accessible, versatile electric platform for adventure, everyday journeys and working on the water.",
      stats: [
        ["10", "passengers capacity"],
        ["22", "knots cruise"],
        ["40", "NM range"],
      ],
    },
    f11: {
      title: "The Commercial Hydrofoil",
      description:
        "Designed to move people profitably. A commercial transit platform in development for cities, transport authorities and fleet operators.",
      stats: [],
    },
  },
  ru: {
    label: "02 / МОДЕЛЬНЫЙ РЯД FLYMAR",
    title: "Ваш путь\nвыше волн.",
    intro:
      "Единая технологическая платформа. Две разные задачи. F8 — свобода каждый день. F11 — регулярный общественный транспорт.",
    previous: "Предыдущая модель",
    next: "Следующая модель",
    enquire: "Связаться",
    details: "Открыть модель",
    f8: {
      title: "Электрическое судно на каждый день",
      description:
        "Одно судно. Множество задач. Универсальная электрическая платформа для приключений, повседневных поездок и работы на воде.",
      stats: [
        ["10", "пассажиров"],
        ["22", "узла, крейсерская"],
        ["40", "морских миль"],
      ],
    },
    f11: {
      title: "Коммерческий транспорт на крыльях",
      description:
        "Создан для рентабельных перевозок. Коммерческая транспортная платформа в разработке — для городов, перевозчиков и операторов флота.",
      stats: [],
    },
  },
};

export const evolutionCopy = {
  en: {
    hero: [
      {
        title: ["Experience the future", "on water today."],
        description: "Faster, quieter, and effortlessly stable water mobility.",
      },
      {
        title: ["Radically Lower OPEX.", "Zero Fuel Volatility."],
        description:
          "Hydrofoils cut water resistance by up to 80%—delivering massive energy savings and zero diesel maintenance.",
      },
      {
        title: ["De-Risk Your Operations", "at Every Mile"],
        description:
          "Active collision avoidance prevents obstacles automatically, backed by full maritime-standard cabin safety.",
      },
    ],
    autonomyLabel: "01 / AUTONOMY FIRST",
    autonomyTitle: "Autonomy First:\nfull autopilot for\nmaximum efficiency.",
    autonomyText:
      "Full autopilot for maximum efficiency. Hydrofoils for top speed and the comfort of your passengers.",
    upTo: "SPEED UP TO",
    rangeLabel: "RANGE",
    knots: "knots",
    speed: "Speed that moves you forward",
    km: "km",
    range: "On one charge",
    autonomyNote: "Performance varies by model and operating conditions.",
    autonomyImage: "FLYMAR vessel and navigation controls on a tablet",
    businessTitle:
      "Unlock a new level\nof efficiency and comfort\nfor your business.",
    businessIntro:
      "Make every route an advantage. And every journey an experience.",
    business: [
      {
        title: "Urban & Regional\nPassenger Transport",
        tag: "F11 / BUILT TO MOVE CITIES",
        text: "Build the business case for waterborne transit. F11 puts capacity, route planning and fleet operations at the centre of the conversation.",
      },
      {
        title: "Premium Tourism\n& Resort Mobility",
        tag: "F8 / ONE VESSEL. ENDLESS MISSIONS.",
        text: "Offer your guests an exclusive, whisper-quiet flight over water that turns simple point-to-point transfers into a signature luxury experience.",
      },
    ],
  },
  ru: {
    hero: [
      {
        title: ["Будущее на воде.", "Уже сегодня."],
        description: "Передвижение по воде — быстрее, тише и с исключительной устойчивостью.",
      },
      {
        title: ["Радикально ниже расходы.", "Без скачков цен на топливо."],
        description:
          "Подводные крылья снижают сопротивление воды до 80% — значительная экономия энергии без обслуживания дизельного двигателя.",
      },
      {
        title: ["Меньше рисков", "на каждой миле"],
        description:
          "Активная система предотвращения столкновений автоматически избегает препятствий. Безопасность салона обеспечена в соответствии с морскими стандартами.",
      },
    ],
    autonomyLabel: "01 / AUTONOMY FIRST",
    autonomyTitle:
      "Автономность прежде всего:\nполный автопилот для\nмаксимальной эффективности.",
    autonomyText:
      "Полный автопилот для максимальной эффективности. Подводные крылья для высокой скорости и комфорта ваших пассажиров.",
    upTo: "СКОРОСТЬ ДО",
    rangeLabel: "ЗАПАС ХОДА",
    knots: "узлов",
    speed: "Скорость, которая движет вперёд",
    km: "км",
    range: "На одном заряде",
    autonomyNote: "Показатели зависят от модели и условий эксплуатации.",
    autonomyImage: "Судно FLYMAR и управление навигацией с планшета",
    businessTitle:
      "Новый уровень\nэффективности и комфорта\nдля вашего бизнеса.",
    businessIntro:
      "Преимущества на каждом маршруте. Впечатления в каждом путешествии.",
    business: [
      {
        title: "Городские и региональные\nпассажирские перевозки",
        tag: "F11 / ТРАНСПОРТ ДЛЯ ГОРОДА",
        text: "Начните с экономики водного транспорта. F11 ставит во главу угла вместимость, планирование маршрутов и эксплуатацию флота.",
      },
      {
        title: "Премиальный туризм\nи курортные трансферы",
        tag: "F8 / ОДНО СУДНО. МНОЖЕСТВО ЗАДАЧ.",
        text: "Предложите гостям эксклюзивный, почти бесшумный полёт над водой. Превратите обычный трансфер из точки в точку в незабываемое премиальное путешествие.",
      },
    ],
  },
};

export const productCopy = {
  en: {
    back: "All vessels",
    specs: "Specifications",
    inside: "Step inside",
    view: "View the interior",
    contact: "Discuss this vessel",
    gallery: "Explore every angle",
    next: "Next photograph",
    previous: "Previous photograph",
    f8: {
      eyebrow: "THE EVERYDAY ELECTRIC HYDROFOIL",
      title: "One vessel.\nEndless missions.",
      intro:
        "The Flymar F8 is an all-electric, 10-passenger hydrofoil shuttle engineered for high-frequency urban transit and luxury resort connectivity.",
      storyTitle: "Thoughtful in every detail.",
      story:
        "Front and rear entrances keep boarding simple. Dedicated luggage space and a comfortable interior leave room to enjoy the journey.",
      engineeringTitle: "Electric boating.\nEveryday versatility.",
      engineering:
        "Move in displacement mode or rise above the water on hydrofoils. A direct-drive electric engine keeps maintenance low, while wheel and joystick controls put everything within reach.",
      specifications: [
        ["Passengers", "10"],
        ["Cruise speed", "22 knots"],
        ["Range", "40 NM"],
        ["Propulsion", "Electric, direct drive"],
        ["Controls", "Steering wheel & joystick"],
        ["Access", "Front & rear"],
      ],
      note: "Range depends on load and operating conditions.",
      features: [
        "Front & rear access",
        "Dedicated luggage space",
        "Wheel & joystick controls",
      ],
      photos: ["hero-open-water", "f8-boarding", "leisure", "f8-cockpit"],
      captions: [
        "The freedom to explore",
        "A new arrival, a new adventure",
        "Built for every day on the water",
        "Designed around the skipper",
      ],
    },
    f11: {
      eyebrow: "THE COMMERCIAL HYDROFOIL",
      title: "Built to\nmove cities.",
      intro:
        "The next commercial transit platform from FLYMAR. In development for operators, cities and transport authorities — with fleet deployment, passenger throughput and lifecycle economics at its core.",
      storyTitle: "Passenger flow.\nOperational focus.",
      story:
        "An early look at the F11 cabin concept. Boarding flow, turnaround and seat utilisation are central to the operating brief. The final configuration will be presented at launch.",
      engineeringTitle: "A transit asset.\nDefined by engineering.",
      engineering: "A dedicated commercial transit platform in development.",
      specifications: [],
      note: "Coming Soon. Technical specifications will be shared at launch.",
      features: [],
      photos: ["f11-plan", "f11-interior", "f11-profile", "f11-views"],
      captions: [
        "Passenger layout, viewed from above",
        "Passenger cabin concept",
        "The F11 in profile",
        "Exterior views",
      ],
    },
  },
  ru: {
    back: "Все модели",
    specs: "Характеристики",
    inside: "Пространство внутри",
    view: "Посмотреть интерьер",
    contact: "Обсудить эту модель",
    gallery: "Рассмотрите каждую деталь",
    next: "Следующая фотография",
    previous: "Предыдущая фотография",
    f8: {
      eyebrow: "ЭЛЕКТРИЧЕСКОЕ СУДНО НА КАЖДЫЙ ДЕНЬ",
      title: "Одно судно.\nМножество задач.",
      intro:
        "Flymar F8 — полностью электрический шаттл на подводных крыльях для 10 пассажиров, созданный для частых городских рейсов и сообщения с премиальными курортами.",
      storyTitle: "Продуман в каждой детали.",
      story:
        "Входы спереди и сзади упрощают посадку. Предусмотренное место для багажа и комфортный интерьер позволяют наслаждаться путешествием.",
      engineeringTitle: "Электрическая тяга.\nСвобода каждый день.",
      engineering:
        "Двигайтесь в водоизмещающем режиме или поднимайтесь над водой на подводных крыльях. Электродвигатель с прямым приводом требует минимум обслуживания. Руль и джойстик делают управление удобным.",
      specifications: [
        ["Пассажиров", "10"],
        ["Крейсерская скорость", "22 узла"],
        ["Запас хода", "40 морских миль"],
        ["Двигатель", "Электрический, прямой привод"],
        ["Управление", "Руль и джойстик"],
        ["Входы", "Спереди и сзади"],
      ],
      note: "Запас хода зависит от загрузки и условий эксплуатации.",
      features: [
        "Два входа: спереди и сзади",
        "Место для багажа",
        "Руль и джойстик",
      ],
      photos: ["hero-open-water", "f8-boarding", "leisure", "f8-cockpit"],
      captions: [
        "Свобода исследовать",
        "Новое место — новое приключение",
        "Для каждого дня на воде",
        "Всё для удобного управления",
      ],
    },
    f11: {
      eyebrow: "КОММЕРЧЕСКИЙ ТРАНСПОРТ НА КРЫЛЬЯХ",
      title: "Создан\nдля движения города.",
      intro:
        "Новая коммерческая транспортная платформа FLYMAR. Разрабатывается для операторов, городов и перевозчиков — с акцентом на развёртывание флота, пассажиропоток и экономику жизненного цикла.",
      storyTitle: "Пассажиропоток.\nВзгляд оператора.",
      story:
        "Первый взгляд на концепцию салона F11. Потоки при посадке, время оборота и загрузка — в центре эксплуатационных задач. Итоговая конфигурация будет представлена к запуску.",
      engineeringTitle: "Транспортный актив.\nИнженерная основа.",
      engineering:
        "Специализированная коммерческая транспортная платформа в разработке.",
      specifications: [],
      note: "Coming Soon. Технические характеристики будут представлены к запуску.",
      features: [],
      photos: ["f11-plan", "f11-interior", "f11-profile", "f11-views"],
      captions: [
        "Планировка пассажирского салона",
        "Концепция пассажирского салона",
        "F11 в профиль",
        "Внешние ракурсы",
      ],
    },
  },
};
