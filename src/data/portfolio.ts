/** Демонстрационные примеры. Не реальные объекты. */
export type Project = {
  n: string;
  title: string;
  area: string;
  kind: "apartment" | "office" | "balcony" | "storefront";
  note: string;
  seed: number;
};

export const projects: Project[] = [
  { n: "01", title: "Панорамные окна квартиры", area: "42 м²", kind: "apartment", note: "Две стороны, штанги, без разводов на солнце.", seed: 101 },
  { n: "02", title: "Офисное остекление", area: "86 м²", kind: "office", note: "По графику, до начала рабочего дня.", seed: 102 },
  { n: "03", title: "Балкон", area: "18 м²", kind: "balcony", note: "Раздвижные створки, внутренняя и внешняя сторона.", seed: 103 },
  { n: "04", title: "Витрина", area: "31 м²", kind: "storefront", note: "Кафе на первом этаже. Успели до открытия.", seed: 104 },
];
