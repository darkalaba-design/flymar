export const fonts = {
  sans: "Arial, Helvetica, sans-serif",
  humanist: '"Trebuchet MS", Arial, sans-serif',
  editorial: 'Georgia, "Times New Roman", serif',
  technical: '"Courier New", Courier, monospace',
} as const;

export const defaults = {
  ink: "#152c31",
  paper: "#f3f3ed",
  muted: "#7b8582",
  white: "#ffffff",
  accent: "#56b4b1",
  success: "#507b6b",
  danger: "#a84343",
  font: "sans",
  headingFont: "sans",
  bodyScale: 1,
  headingScale: 1,
  density: 1,
  tracking: 1,
  leading: 1,
  radius: 2,
  cardRadius: 5,
  imageRadius: 0,
  buttonHeight: 52,
  borderOpacity: 0.19,
  shadow: 1,
  motion: 1,
} as const;
export type Theme = {
  [K in keyof typeof defaults]: K extends "font" | "headingFont"
    ? keyof typeof fonts
    : (typeof defaults)[K] extends number
      ? number
      : string;
};
export type ThemeKey = keyof Theme;
type Field = {
  key: ThemeKey;
  label: string;
  hint: string;
  group: string;
  type: "color" | "range" | "font";
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
};
export const fields: Field[] = [
  {
    key: "ink",
    label: "Основной цвет",
    hint: "Заголовки, тёмные секции, кнопки и иконки",
    group: "Цвет",
    type: "color",
  },
  {
    key: "paper",
    label: "Фон сайта",
    hint: "Светлые секции и производные поверхности",
    group: "Цвет",
    type: "color",
  },
  {
    key: "muted",
    label: "Вторичный текст",
    hint: "Описания, подписи и метаданные",
    group: "Цвет",
    type: "color",
  },
  {
    key: "white",
    label: "Текст на тёмном",
    hint: "Светлый текст поверх фотографий и тёмных секций",
    group: "Цвет",
    type: "color",
  },
  {
    key: "accent",
    label: "Акцент",
    hint: "Фокус и интерактивные состояния",
    group: "Цвет",
    type: "color",
  },
  {
    key: "success",
    label: "Успех",
    hint: "Статусы и положительные показатели",
    group: "Цвет",
    type: "color",
  },
  {
    key: "danger",
    label: "Ошибка",
    hint: "Сообщения об ошибках",
    group: "Цвет",
    type: "color",
  },
  {
    key: "font",
    label: "Основной шрифт",
    hint: "Текст, кнопки, формы",
    group: "Типографика",
    type: "font",
  },
  {
    key: "headingFont",
    label: "Шрифт заголовков",
    hint: "Hero, заголовки секций и карточек",
    group: "Типографика",
    type: "font",
  },
  {
    key: "bodyScale",
    label: "Размер текста",
    hint: "Вся шкала текста и подписей",
    group: "Типографика",
    type: "range",
    min: 0.9,
    max: 1.25,
    step: 0.05,
    unit: "×",
  },
  {
    key: "headingScale",
    label: "Размер заголовков",
    hint: "Адаптивные заголовки и крупные цифры",
    group: "Типографика",
    type: "range",
    min: 0.85,
    max: 1.15,
    step: 0.05,
    unit: "×",
  },
  {
    key: "tracking",
    label: "Межбуквенный интервал",
    hint: "Общий коэффициент существующей шкалы",
    group: "Типографика",
    type: "range",
    min: 0,
    max: 1.3,
    step: 0.1,
    unit: "×",
  },
  {
    key: "leading",
    label: "Высота строки",
    hint: "Ритм текста и заголовков",
    group: "Типографика",
    type: "range",
    min: 0.95,
    max: 1.2,
    step: 0.05,
    unit: "×",
  },
  {
    key: "density",
    label: "Воздух и отступы",
    hint: "Внутренние поля, интервалы и отступы секций",
    group: "Геометрия",
    type: "range",
    min: 0.85,
    max: 1.2,
    step: 0.05,
    unit: "×",
  },
  {
    key: "radius",
    label: "Скругление кнопок и полей",
    hint: "Общие элементы управления",
    group: "Геометрия",
    type: "range",
    min: 0,
    max: 28,
    step: 1,
    unit: "px",
  },
  {
    key: "cardRadius",
    label: "Скругление карточек",
    hint: "Модели, преимущества и информационные панели",
    group: "Геометрия",
    type: "range",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
  },
  {
    key: "imageRadius",
    label: "Скругление изображений",
    hint: "Фотографии внутри карточек и галерей",
    group: "Геометрия",
    type: "range",
    min: 0,
    max: 32,
    step: 1,
    unit: "px",
  },
  {
    key: "buttonHeight",
    label: "Высота кнопок",
    hint: "Основные CTA на всех страницах",
    group: "Геометрия",
    type: "range",
    min: 44,
    max: 68,
    step: 2,
    unit: "px",
  },
  {
    key: "borderOpacity",
    label: "Контраст линий",
    hint: "Разделители и границы",
    group: "Эффекты",
    type: "range",
    min: 0.08,
    max: 0.4,
    step: 0.01,
  },
  {
    key: "shadow",
    label: "Глубина теней",
    hint: "Окна, панели и приподнятые элементы",
    group: "Эффекты",
    type: "range",
    min: 0,
    max: 1.5,
    step: 0.1,
    unit: "×",
  },
  {
    key: "motion",
    label: "Длительность анимации",
    hint: "0 — без анимаций; системное уменьшение движения учитывается",
    group: "Эффекты",
    type: "range",
    min: 0,
    max: 1.5,
    step: 0.1,
    unit: "×",
  },
];

export const tokenName = (key: string) =>
  `--fm-${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;

export function validateTheme(raw: unknown): Theme {
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    throw new Error("invalid_theme");
  const input = raw as Record<string, unknown>;
  if (Object.keys(input).some((key) => !fields.some((f) => f.key === key)))
    throw new Error("invalid_theme");
  const result = { ...defaults } as Theme;
  for (const field of fields) {
    const value = input[field.key];
    if (value === undefined) throw new Error("invalid_theme");
    if (
      field.type === "color" &&
      (typeof value !== "string" || !/^#[0-9a-f]{6}$/i.test(value))
    )
      throw new Error("invalid_theme");
    if (
      field.type === "font" &&
      (typeof value !== "string" || !Object.hasOwn(fonts, value))
    )
      throw new Error("invalid_theme");
    if (
      field.type === "range" &&
      (typeof value !== "number" ||
        !Number.isFinite(value) ||
        value < field.min! ||
        value > field.max!)
    )
      throw new Error("invalid_theme");
    Object.assign(result, { [field.key]: value });
  }
  return result;
}

export function themeVariables(theme: Theme): Record<string, string> {
  return Object.fromEntries(
    fields.map((f) => [
      tokenName(f.key),
      f.type === "font"
        ? fonts[theme[f.key] as keyof typeof fonts]
        : `${theme[f.key]}${f.unit === "px" ? "px" : ""}`,
    ]),
  );
}
export function themeCss(theme: Theme) {
  return `:root{${Object.entries(themeVariables(validateTheme(theme)))
    .map(([k, v]) => `${k}:${v}`)
    .join(";")}}`;
}
export const presets: Record<
  string,
  { label: string; description: string; theme: Theme }
> = {
  original: {
    label: "FLYMAR Original",
    description: "Текущая палитра и пропорции",
    theme: { ...defaults },
  },
  editorial: {
    label: "Editorial",
    description: "Тёплая бумага, журнальные заголовки",
    theme: {
      ...defaults,
      ink: "#302b28",
      paper: "#f5efe5",
      muted: "#82766d",
      accent: "#a3794c",
      headingFont: "editorial",
      density: 1.1,
    },
  },
  ocean: {
    label: "Ocean",
    description: "Холодный синий, мягкие карточки",
    theme: {
      ...defaults,
      ink: "#122e50",
      paper: "#edf4f8",
      muted: "#718295",
      accent: "#148aab",
      cardRadius: 20,
      radius: 26,
      imageRadius: 12,
    },
  },
  precision: {
    label: "Precision",
    description: "Графит, компактность и прямые углы",
    theme: {
      ...defaults,
      ink: "#20252a",
      paper: "#f1f2f3",
      muted: "#777d83",
      accent: "#397e88",
      density: 0.9,
      cardRadius: 0,
      radius: 0,
      headingFont: "humanist",
    },
  },
};

export function contrast(a: string, b: string) {
  const luminance = (s: string) => {
    const v = [1, 3, 5]
      .map((i) => parseInt(s.slice(i, i + 2), 16) / 255)
      .map((n) => (n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4));
    return v[0] * 0.2126 + v[1] * 0.7152 + v[2] * 0.0722;
  };
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
