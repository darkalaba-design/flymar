import type { Metadata } from "next";
import type { Locale } from "./content";
export type CompanyPage = "about" | "contacts" | "technology";
export const companyHref = (page: CompanyPage, locale: Locale) =>
  `${locale === "ru" ? "/ru" : ""}/${page}`;
export const companyDetails = {
  email: "hello@flymar.tech",
  ogrn: "1257800000303",
  inn: "7801739300",
  kpp: "780101001",
  map: "https://yandex.ru/maps/2/saint-petersburg/house/petrovskaya_kosa_6k1/Z0kYdANlTEMBQFtjfXV3cnxlYg==/?ll=30.245566%2C59.963066&z=16.66",
};
// Adapted from the client's about.html, contacts.html and technology.html.
// Legacy references to the discontinued F9 are deliberately omitted.
export const companyCopy = {
  en: {
    labels: { about: "About", contacts: "Contacts", technology: "Technology" },
    about: {
      title: "Engineering a new\nway to move.",
      description:
        "Meet FLYMAR: a full-stack technology company developing intelligent high-speed vessels in Saint Petersburg.",
      intro:
        "We bring software, marine engineering and electric propulsion together. To rethink what a vessel can be.",
      origin: "Founded in Saint Petersburg",
      imageAlt: "FLYMAR engineers at work in the development studio",
      caption: "Behind the technology. The people who build it.",
      storyTitle: "Intelligence first.\nEverything connected.",
      story: [
        "FLYMAR was founded in Saint Petersburg in 2025 to develop technologies for the next generation of high-speed water transport.",
        "We see a modern vessel as an integrated software and hardware system — a computer on the water. Our focus is computer vision for situational awareness, drive-by-wire control and energy-efficient electric propulsion.",
      ],
      fullStack: "FROM SOFTWARE TO VESSEL",
      statement: "A computer.\nOn the water.",
      statementText:
        "As a full-stack company, we develop the intelligence and the systems that bring it to life. One connected approach to the entire vessel.",
      expertiseTitle: "Different disciplines.\nOne team.",
      expertiseIntro:
        "Our team brings years of experience in autonomous vehicle software, shipbuilding and power electronics.",
      expertise: [
        [
          "Software & AI",
          "Computer vision and software for autonomous systems. Intelligence that starts with understanding the environment.",
        ],
        [
          "Marine engineering",
          "Shipbuilding experience applied to the vessel as a whole — from its structure to the way it moves through water.",
        ],
        [
          "Power electronics",
          "Electric drives and control electronics developed as part of one integrated platform.",
        ],
      ],
      link: "Explore our technology",
    },
    technology: {
      title: "Software-defined\nvessels.",
      description:
        "Inside FLYMAR technology: Autonomy First, in-house control electronics, software-controlled hydrofoils and direct electric propulsion.",
      intro:
        "We build intelligent vessels around software and sensors. Intelligence first. The vessel around it.",
      heroAlt:
        "FLYMAR vessel with an illustration of its navigation sensing systems",
      principle: "What we do differently.",
      principleText:
        "The vessel of the future is intelligent and adaptive, designed for changing conditions. We develop high-speed vessels around sensors, software and autonomous intelligence from the very beginning. We call this principle Autonomy First.",
      architecture: "FOUR SYSTEMS. ONE CONNECTED VESSEL.",
      systems: [
        {
          id: "autonomy",
          label: "Autonomy First",
          title: "Built to\nunderstand.",
          text: "Computer vision and sensors bring situational awareness to the centre of vessel design. The intelligence is developed first, with the vessel built around it.",
          image: "company-sensors",
          alt: "FLYMAR sensor unit in the engineering workshop",
          tags: ["Computer vision", "Sensors", "Situational awareness"],
        },
        {
          id: "control",
          label: "FLYMAR Control Unit",
          title: "One connected\ncontrol system.",
          text: "We develop core electronics, sensors and control systems in-house. Connected and autonomy-ready by design, the platform supports flexible operation from the helm or remotely from shore.",
          image: "company-control",
          alt: "FLYMAR Control Unit electronic circuit board",
          tags: ["In-house electronics", "Drive by wire", "Remote operation"],
        },
        {
          id: "foiling",
          label: "Intelligent foiling",
          title: "Precision above\nthe surface.",
          text: "Our software-controlled foiling system continuously adjusts the vessel’s attitude and foil surfaces in real time. It optimizes lift, stability and efficiency for a smoother ride and lower energy consumption.",
          image: "company-foils",
          alt: "Engineering model of the FLYMAR hydrofoil control system",
          tags: ["Real-time control", "Stability", "Energy efficiency"],
        },
        {
          id: "edrive",
          label: "FLYMAR E-Drive",
          title: "Direct power.\nQuiet progress.",
          text: "Our in-house underwater direct-drive electric propulsion system is designed for efficiency, reliability and quiet operation. Fewer mechanical components mean less complexity and reduced maintenance.",
          image: "company-edrive",
          alt: "FLYMAR underwater direct-drive electric propulsion unit",
          tags: ["Direct drive", "Electric propulsion", "Quiet operation"],
        },
      ],
      collectionTitle: "Shared intelligence.\nDistinct possibilities.",
      collectionText:
        "Discover two different applications of the FLYMAR technology platform: everyday freedom with F8 and dedicated commercial transit with F11.",
      collectionLink: "Explore the collection",
    },
    contacts: {
      title: "Good things start\nwith a conversation.",
      description:
        "Contact FLYMAR in Saint Petersburg. Project enquiries, partnerships, company address and registration details.",
      intro:
        "A new route. A technology partnership. Your next vessel. Tell us what you have in mind.",
      write: "FOR ALL ENQUIRIES",
      form: "Tell us about your project",
      city: "Saint Petersburg",
      country: "Russia",
      address: "Petrovskaya Kosa, 6, building 1",
      addressLabel: "OUR ADDRESS",
      map: "Open in maps",
      legalTitle: "Company details.",
      legalName: "FLYMAR Joint Stock Company",
      registered: "Registered address",
      legalAddress:
        "197198, Saint Petersburg, Petrovskaya Kosa, 6, block 1, building 1, premises 11N, Russia",
      registration: "State registration number (OGRN)",
      tax: "Taxpayer ID (INN)",
      branch: "Tax registration code (KPP)",
    },
  },
  ru: {
    labels: {
      about: "О компании",
      contacts: "Контакты",
      technology: "Технологии",
    },
    about: {
      title: "Создаём новый\nспособ двигаться.",
      description:
        "FLYMAR — компания полного цикла из Санкт-Петербурга. Разрабатываем интеллектуальные технологии для скоростного водного транспорта.",
      intro:
        "Объединяем программное обеспечение, судостроение и электрическую тягу. Чтобы по-новому взглянуть на возможности судна.",
      origin: "Основаны в Санкт-Петербурге",
      imageAlt: "Инженеры FLYMAR за работой в студии разработки",
      caption: "За каждой технологией — люди, которые её создают.",
      storyTitle: "Интеллект в основе.\nВсё взаимосвязано.",
      story: [
        "Компания FLYMAR создана в 2025 году в Санкт-Петербурге. Мы разрабатываем технологии для скоростного водного транспорта будущего.",
        "В нашей концепции современное судно — программно-аппаратный комплекс, «компьютер на воде». Поэтому мы сфокусированы на машинном зрении для ситуативной осведомлённости, управлении по проводам и энергоэффективных электроприводах.",
      ],
      fullStack: "ОТ ПРОГРАММНОГО КОДА ДО СУДНА",
      statement: "Компьютер.\nНа воде.",
      statementText:
        "FLYMAR — компания полного цикла. Мы создаём интеллект и системы, которые воплощают его в движении. Единый подход к разработке всего судна.",
      expertiseTitle: "Разные дисциплины.\nОдна команда.",
      expertiseIntro:
        "За нашей командой — многолетний опыт разработки ПО для беспилотных автомобилей, судостроения и силовой электроники.",
      expertise: [
        [
          "Программное обеспечение и AI",
          "Машинное зрение и ПО для беспилотных систем. Интеллект, который начинается с понимания окружающей среды.",
        ],
        [
          "Судостроение",
          "Инженерный опыт и целостный взгляд на судно — от его конструкции до движения по воде.",
        ],
        [
          "Силовая электроника",
          "Электроприводы и управляющая электроника, разработанные как части единой платформы.",
        ],
      ],
      link: "Открыть технологии",
    },
    technology: {
      title: "Интеллект\nна воде.",
      description:
        "Технологии FLYMAR: Autonomy First, собственная управляющая электроника, программное управление подводными крыльями и прямой электропривод.",
      intro:
        "Создаём интеллектуальные суда вокруг программного обеспечения и датчиков. Сначала интеллект. Затем судно вокруг него.",
      heroAlt: "Судно FLYMAR с визуализацией работы навигационных датчиков",
      principle: "Наш подход к разработке.",
      principleText:
        "Судно будущего — интеллектуальное и адаптивное, рассчитанное на изменяющиеся условия. Поэтому с самого начала мы проектируем скоростные суда вокруг датчиков, программного обеспечения и автономных систем. Этот принцип мы называем Autonomy First.",
      architecture: "ЧЕТЫРЕ СИСТЕМЫ. ОДНО ЦЕЛОЕ.",
      systems: [
        {
          id: "autonomy",
          label: "Autonomy First",
          title: "Создано, чтобы\nпонимать.",
          text: "Машинное зрение и датчики делают понимание окружающей обстановки основой проектирования. Сначала мы разрабатываем интеллект, а затем строим судно вокруг него.",
          image: "company-sensors",
          alt: "Блок навигационных датчиков FLYMAR в инженерной мастерской",
          tags: ["Машинное зрение", "Датчики", "Осведомлённость"],
        },
        {
          id: "control",
          label: "FLYMAR Control Unit",
          title: "Единая система\nуправления.",
          text: "Ключевую электронику, датчики и системы управления мы разрабатываем сами. Связность и готовность к автономной работе заложены в архитектуру: управление возможно из рубки или дистанционно с берега.",
          image: "company-control",
          alt: "Плата управляющей электроники FLYMAR Control Unit",
          tags: ["Своя электроника", "Drive by wire", "Удалённое управление"],
        },
        {
          id: "foiling",
          label: "Интеллектуальные крылья",
          title: "Точность выше\nповерхности.",
          text: "Программная система непрерывно регулирует положение судна и поверхности подводных крыльев в реальном времени. Оптимизация подъёмной силы, устойчивости и эффективности обеспечивает плавный ход и снижает энергопотребление.",
          image: "company-foils",
          alt: "Инженерная модель системы управления подводными крыльями FLYMAR",
          tags: [
            "Контроль в реальном времени",
            "Устойчивость",
            "Эффективность",
          ],
        },
        {
          id: "edrive",
          label: "FLYMAR E-Drive",
          title: "Прямая тяга.\nТихое движение.",
          text: "Наш подводный электрический движитель с прямым приводом разработан для эффективной, надёжной и тихой работы. Меньше механических компонентов — проще конструкция и меньше обслуживания.",
          image: "company-edrive",
          alt: "Подводный электрический движитель FLYMAR с прямым приводом",
          tags: ["Прямой привод", "Электрическая тяга", "Тихая работа"],
        },
      ],
      collectionTitle: "Общий интеллект.\nРазные возможности.",
      collectionText:
        "Два применения технологической платформы FLYMAR: свобода каждый день с F8 и регулярные коммерческие перевозки с F11.",
      collectionLink: "К модельному ряду",
    },
    contacts: {
      title: "Всё начинается\nс разговора.",
      description:
        "Контакты FLYMAR в Санкт-Петербурге. Обсуждение проектов и сотрудничества, адрес компании и реквизиты.",
      intro:
        "Новый маршрут. Технологическое партнёрство. Ваше будущее судно. Расскажите, что вы задумали.",
      write: "ПО ЛЮБЫМ ВОПРОСАМ",
      form: "Рассказать о проекте",
      city: "Санкт-Петербург",
      country: "Россия",
      address: "Петровская коса, 6к1",
      addressLabel: "НАШ АДРЕС",
      map: "Открыть на карте",
      legalTitle: "Реквизиты компании.",
      legalName: "Акционерное общество «ФЛАЙМАР»",
      registered: "Юридический адрес",
      legalAddress:
        "197198, город Санкт-Петербург, Петровская коса, д. 6 к. 1 стр. 1, помещ. 11Н",
      registration: "ОГРН",
      tax: "ИНН",
      branch: "КПП",
    },
  },
};
export function companyMetadata(page: CompanyPage, locale: Locale): Metadata {
  const t = companyCopy[locale];
  const title = `${t.labels[page]} — FLYMAR`;
  return {
    title,
    description: t[page].description,
    alternates: {
      canonical: companyHref(page, locale),
      languages: { en: companyHref(page, "en"), ru: companyHref(page, "ru") },
    },
    openGraph: {
      title,
      description: t[page].description,
      url: companyHref(page, locale),
      images: [
        {
          url:
            page === "about"
              ? "/media/company-team.webp"
              : "/media/hero-city.webp",
        },
      ],
    },
  };
}
