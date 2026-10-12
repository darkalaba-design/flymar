import type { Locale } from "./content";

export const fleet = ["f8", "f9", "f11", "f30"] as const;
export type ModelId = "f8" | "f11";
export type FleetId = (typeof fleet)[number];
export function modelHref(model: ModelId, locale: Locale) {
  return `${locale === "ru" ? "/ru" : ""}/models/${model}`;
}
export const fleetCopy = {
  en: {
    label: "02 / THE FLYMAR COLLECTION",
    title: "Find your way\nabove the water.",
    intro:
      "Different scales. The same ambition. Discover a vessel for your next chapter.",
    previous: "Previous vessel",
    next: "Next vessel",
    preview: "Visuals coming soon",
    coming: "More details coming soon",
    enquire: "Get in touch",
    details: "Explore the model",
    f8: {
      title: "A smarter everyday.",
      description:
        "Electric hydrofoil. Purpose-built for effortless passenger journeys.",
      stats: [
        ["10", "passengers"],
        ["22", "knots cruise"],
        ["40", "NM range"],
      ],
    },
    f9: {
      title: "A new possibility.",
      description:
        "A compact addition to the FLYMAR collection. Discover the first details.",
      stats: [
        ["9", "passengers"],
        ["80", "km range"],
      ],
    },
    f11: {
      title: "More room to move.",
      description:
        "A carbon-fibre hydrofoil catamaran. A new perspective for 30 passengers.",
      stats: [
        ["30", "passengers"],
        ["27", "knots cruise"],
        ["11", "metres long"],
      ],
    },
    f30: {
      title: "A wider horizon.",
      description:
        "A 30-passenger model. Further specifications and imagery will follow.",
      stats: [
        ["30", "passengers"],
        ["—", "range to be confirmed"],
      ],
    },
  },
  ru: {
    label: "02 / МОДЕЛЬНЫЙ РЯД FLYMAR",
    title: "Ваш путь\nвыше волн.",
    intro:
      "Разный масштаб. Единое стремление. Найдите судно для нового этапа вашего бизнеса.",
    previous: "Предыдущая модель",
    next: "Следующая модель",
    preview: "Изображения скоро появятся",
    coming: "Подробности скоро",
    enquire: "Связаться",
    details: "Открыть модель",
    f8: {
      title: "Умнее каждый день.",
      description:
        "Электрическое судно на подводных крыльях для комфортных пассажирских маршрутов.",
      stats: [
        ["10", "пассажиров"],
        ["22", "узла, крейсерская"],
        ["40", "морских миль"],
      ],
    },
    f9: {
      title: "Новые возможности.",
      description:
        "Компактная модель в линейке FLYMAR. Знакомьтесь с первыми характеристиками.",
      stats: [
        ["9", "пассажиров"],
        ["80", "км запаса хода"],
      ],
    },
    f11: {
      title: "Больше места для движения.",
      description:
        "Катамаран на подводных крыльях с углеволоконным корпусом. Новый взгляд для 30 пассажиров.",
      stats: [
        ["30", "пассажиров"],
        ["27", "узлов, крейсерская"],
        ["11", "метров длина"],
      ],
    },
    f30: {
      title: "Горизонт становится шире.",
      description:
        "Модель на 30 пассажиров. Остальные характеристики и изображения появятся позже.",
      stats: [
        ["30", "пассажиров"],
        ["—", "запас хода уточняется"],
      ],
    },
  },
};

export const evolutionCopy = {
  en: {
    hero: [
      {
        title: ["A new perspective.", "Above the water."],
        description:
          "Meet the electric hydrofoil that moves your business forward. Quietly. Intelligently. Effortlessly.",
      },
      {
        title: ["Experience the future", "on water today."],
        description: "Faster, quieter, and effortlessly stable.",
      },
      {
        title: ["More freedom.", "Every nautical mile."],
        description:
          "Turn open water into new opportunities. Connect people, places and possibilities with FLYMAR.",
      },
    ],
    autonomyLabel: "01 / AUTONOMY FIRST",
    autonomyTitle: "Autonomy first.\nPossibility, amplified.",
    autonomyText:
      "Full autopilot for maximum efficiency. Hydrofoils for top speed and the comfort of your passengers.",
    upTo: "UP TO",
    knots: "knots",
    speed: "Speed that moves you forward",
    km: "km",
    range: "On one charge",
    autonomyNote: "Performance varies by model and operating conditions.",
    autonomyImage: "FLYMAR navigation sensors scanning the water",
    businessTitle:
      "Unlock a new level\nof efficiency and comfort\nfor your business.",
    businessIntro:
      "Make every route an advantage. And every journey an experience.",
    business: [
      {
        title: "Urban & Regional\nPassenger Transport",
        tag: "01 / CONNECT THE CITY",
        text: "Scale your passenger network with quiet, captain-optional hydrofoils engineered for low-cost, high-efficiency daily routes.",
      },
      {
        title: "Premium Tourism\n& Resort Mobility",
        tag: "02 / ELEVATE THE ARRIVAL",
        text: "Offer your guests an exclusive, whisper-quiet flight over water that turns simple point-to-point transfers into a signature luxury experience.",
      },
    ],
  },
  ru: {
    hero: [
      {
        title: ["Новый взгляд.", "Выше волн."],
        description:
          "Электрическое судно на подводных крыльях, которое движет ваш бизнес вперёд. Тихо. Умно. Легко.",
      },
      {
        title: ["Будущее на воде.", "Уже сегодня."],
        description: "Быстрее, тише и с исключительной устойчивостью.",
      },
      {
        title: ["Больше свободы.", "В каждой миле."],
        description:
          "Превратите водные пути в новые возможности. Соединяйте людей, места и идеи вместе с FLYMAR.",
      },
    ],
    autonomyLabel: "01 / AUTONOMY FIRST",
    autonomyTitle: "Автономность в основе.\nБольше возможностей.",
    autonomyText:
      "Полный автопилот для максимальной эффективности. Подводные крылья для высокой скорости и комфорта ваших пассажиров.",
    upTo: "ДО",
    knots: "узлов",
    speed: "Скорость, которая движет вперёд",
    km: "км",
    range: "На одном заряде",
    autonomyNote: "Показатели зависят от модели и условий эксплуатации.",
    autonomyImage: "Датчики навигации FLYMAR сканируют водное пространство",
    businessTitle:
      "Новый уровень\nэффективности и комфорта\nдля вашего бизнеса.",
    businessIntro:
      "Преимущества на каждом маршруте. Впечатления в каждом путешествии.",
    business: [
      {
        title: "Городские и региональные\nпассажирские перевозки",
        tag: "01 / СОЕДИНЯТЬ ГОРОД",
        text: "Масштабируйте пассажирскую сеть с тихими судами на подводных крыльях, способными работать без капитана. Для экономичных и эффективных ежедневных маршрутов.",
      },
      {
        title: "Премиальный туризм\nи курортные трансферы",
        tag: "02 / ВПЕЧАТЛЯТЬ С ПЕРВОЙ МИНУТЫ",
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
      eyebrow: "ELECTRIC HYDROFOIL",
      title: "A smarter way\nto make the everyday.",
      intro:
        "Meet FLYMAR F8. Electric propulsion, intelligent control and a passenger-first layout. Built to make the water part of everyday life.",
      storyTitle: "Thoughtful in every detail.",
      story:
        "Front and rear entrances keep boarding simple. Dedicated luggage space and a comfortable interior leave room to enjoy the journey.",
      engineeringTitle: "Two modes.\nOne effortless experience.",
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
      photos: ["interior", "f8-cockpit", "f8-boarding", "f8-profile"],
      captions: [
        "A quieter passenger experience",
        "Designed around the skipper",
        "Easy access on board",
        "Hydrofoil configuration",
      ],
    },
    f11: {
      eyebrow: "HYDROFOIL CATAMARAN",
      title: "A bigger perspective.\nFor everyone on board.",
      intro:
        "Meet FLYMAR F11. A hydrofoil catamaran with a carbon-fibre hull, designed to welcome 30 passengers aboard.",
      storyTitle: "Space for thirty.\nRoom for a new experience.",
      story:
        "An open central aisle, panoramic glazing and rows of individual seats. Explore a cabin designed around shared journeys.",
      engineeringTitle: "Lightweight material.\nA larger ambition.",
      engineering:
        "An 11-metre hull, a 4-metre beam and carbon-fibre construction. The F11 combines a hydrofoil catamaran layout with a cruise speed of 27 knots — 50 km/h.",
      specifications: [
        ["Length overall", "11 m"],
        ["Beam overall", "4 m"],
        ["Cruise speed", "27 knots / 50 km/h"],
        ["Hull material", "Carbon fibre"],
        ["Crew", "1–2 people"],
        ["Passengers", "30"],
      ],
      note: "Range and propulsion specifications will be announced separately.",
      features: ["30 passenger seats", "Carbon-fibre hull", "1–2 crew"],
      photos: ["f11-interior", "f11-plan", "f11-profile", "f11-views"],
      captions: [
        "A cabin with a wider perspective",
        "Passenger layout, viewed from above",
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
      eyebrow: "ЭЛЕКТРИЧЕСКОЕ СУДНО НА ПОДВОДНЫХ КРЫЛЬЯХ",
      title: "Новый взгляд\nна привычные маршруты.",
      intro:
        "Знакомьтесь: FLYMAR F8. Электрическая тяга, интеллектуальное управление и планировка для комфорта пассажиров. Водные маршруты становятся частью повседневной жизни.",
      storyTitle: "Продуман в каждой детали.",
      story:
        "Входы спереди и сзади упрощают посадку. Предусмотренное место для багажа и комфортный интерьер позволяют наслаждаться путешествием.",
      engineeringTitle: "Два режима.\nОдно ощущение лёгкости.",
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
      photos: ["interior", "f8-cockpit", "f8-boarding", "f8-profile"],
      captions: [
        "Комфорт пассажиров",
        "Всё для удобного управления",
        "Удобная посадка на борт",
        "Конфигурация на подводных крыльях",
      ],
    },
    f11: {
      eyebrow: "КАТАМАРАН НА ПОДВОДНЫХ КРЫЛЬЯХ",
      title: "Шире горизонт.\nДля каждого на борту.",
      intro:
        "Знакомьтесь: FLYMAR F11. Катамаран на подводных крыльях с корпусом из углеродного волокна. Пространство для 30 пассажиров.",
      storyTitle: "Тридцать пассажиров.\nНовые впечатления.",
      story:
        "Открытый центральный проход, панорамное остекление и ряды индивидуальных кресел. Рассмотрите салон для совместных путешествий.",
      engineeringTitle: "Лёгкий материал.\nБольшой замысел.",
      engineering:
        "Длина 11 метров, ширина 4 метра и корпус из углеродного волокна. F11 сочетает компоновку катамарана на подводных крыльях и крейсерскую скорость 27 узлов — 50 км/ч.",
      specifications: [
        ["Длина габаритная", "11 м"],
        ["Ширина габаритная", "4 м"],
        ["Крейсерская скорость", "27 узлов / 50 км/ч"],
        ["Материал корпуса", "Углеродное волокно"],
        ["Экипаж", "1–2 человека"],
        ["Пассажиров", "30"],
      ],
      note: "Данные о запасе хода и силовой установке будут опубликованы отдельно.",
      features: [
        "30 пассажирских мест",
        "Углеволоконный корпус",
        "Экипаж 1–2 человека",
      ],
      photos: ["f11-interior", "f11-plan", "f11-profile", "f11-views"],
      captions: [
        "Салон с новым взглядом",
        "Планировка пассажирского салона",
        "F11 в профиль",
        "Внешние ракурсы",
      ],
    },
  },
};
