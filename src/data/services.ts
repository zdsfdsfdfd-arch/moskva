export type ServiceId =
  | "apartment"
  | "panoramic"
  | "balcony"
  | "storefront"
  | "office"
  | "renovation"
  | "high-access"
  | "mosquito";

export type Service = {
  id: ServiceId;
  title: string;
  short: string;
  description: string;
  priceHint: string;
  /** Facade cell size: how the window sits on the building. */
  size: "s" | "m" | "l" | "xl";
  /** Which calculator preset to open with. */
  preset: { object: string; windows: string; extras?: string[] };
};

export const services: Service[] = [
  {
    id: "apartment",
    title: "Окна в квартирах",
    short: "Стандартные окна",
    description:
      "Стекло с двух сторон, рамы, ручки и уплотнители. Подоконник протираем в подарок — сложно удержаться.",
    priceHint: "от 350 ₽ за створку",
    size: "m",
    preset: { object: "apartment", windows: "standard" },
  },
  {
    id: "panoramic",
    title: "Панорамное остекление",
    short: "Панорамы",
    description:
      "Большие стёкла от пола до потолка. Считаем по площади, работаем со штангами и без разводов на солнце.",
    priceHint: "от 150 ₽/м²",
    size: "xl",
    preset: { object: "apartment", windows: "panoramic" },
  },
  {
    id: "balcony",
    title: "Балконы и лоджии",
    short: "Балконы",
    description:
      "Раздвижные и распашные створки, внутренняя и внешняя сторона, включая ту, до которой никто не дотягивается.",
    priceHint: "от 1 500 ₽",
    size: "l",
    preset: { object: "apartment", windows: "balcony" },
  },
  {
    id: "storefront",
    title: "Витрины",
    short: "Витрины",
    description:
      "Магазины, кафе, салоны. Приезжаем до открытия, чтобы к первому клиенту стекло уже исчезло.",
    priceHint: "от 120 ₽/м²",
    size: "l",
    preset: { object: "shop", windows: "storefront" },
  },
  {
    id: "office",
    title: "Офисы",
    short: "Офисные окна",
    description:
      "Разовая мойка или регулярное обслуживание. Работаем по графику, документы для бухгалтерии — да.",
    priceHint: "по площади",
    size: "m",
    preset: { object: "office", windows: "standard" },
  },
  {
    id: "renovation",
    title: "Окна после ремонта",
    short: "После ремонта",
    description:
      "Строительная пыль, краска, скотч, следы штукатурки. Снимаем аккуратно, без царапин на стекле и профиле.",
    priceHint: "от 450 ₽ за створку",
    size: "m",
    preset: { object: "apartment", windows: "standard", extras: ["renovation"] },
  },
  {
    id: "high-access",
    title: "Труднодоступные окна",
    short: "Сложный доступ",
    description:
      "Глухие створки, высокие этажи, атриумы. Штанги, платформы, при необходимости — промышленные альпинисты.",
    priceHint: "по запросу",
    size: "s",
    preset: { object: "apartment", windows: "complex", extras: ["high-access"] },
  },
  {
    id: "mosquito",
    title: "Москитные сетки",
    short: "Сетки",
    description:
      "Снимаем, моем, сушим, ставим обратно. Отдельно или вместе с окнами.",
    priceHint: "от 250 ₽ за сетку",
    size: "s",
    preset: { object: "apartment", windows: "standard", extras: ["mosquito"] },
  },
];
