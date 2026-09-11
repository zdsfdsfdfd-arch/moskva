export type ObjectType = "apartment" | "house" | "office" | "shop";
export type WindowType = "standard" | "panoramic" | "balcony" | "storefront" | "complex";
export type Sides = "one" | "two";
export type ExtraId = "frames" | "sills" | "mosquito" | "renovation" | "high-access";

export type CalculatorState = {
  object: ObjectType | null;
  windows: WindowType | null;
  /** index into AREA_STOPS */
  areaIndex: number;
  sides: Sides | null;
  extras: ExtraId[];
};

export const AREA_STOPS = [5, 10, 20, 30, 50, 100] as const;

export const objectOptions: { id: ObjectType; label: string; hint: string }[] = [
  { id: "apartment", label: "Квартира", hint: "окна, лоджия, панорама" },
  { id: "house", label: "Дом", hint: "коттедж, таунхаус" },
  { id: "office", label: "Офис", hint: "разово или по графику" },
  { id: "shop", label: "Магазин", hint: "витрины, двери, вывеска" },
];

export const windowOptions: { id: WindowType; label: string; hint: string }[] = [
  { id: "standard", label: "Стандартные", hint: "створки до 2 м" },
  { id: "panoramic", label: "Панорамные", hint: "от пола до потолка" },
  { id: "balcony", label: "Балкон", hint: "много узких створок" },
  { id: "storefront", label: "Витрина", hint: "большие стёкла, улица" },
  { id: "complex", label: "Сложные", hint: "глухие, высокие, атриум" },
];

export const sideOptions: { id: Sides; label: string; hint: string }[] = [
  { id: "one", label: "Одна", hint: "только изнутри" },
  { id: "two", label: "Две", hint: "изнутри и снаружи" },
];

export const extraOptions: { id: ExtraId; label: string; hint: string }[] = [
  { id: "frames", label: "Рамы и откосы", hint: "+15%" },
  { id: "sills", label: "Подоконники", hint: "+8%" },
  { id: "mosquito", label: "Москитные сетки", hint: "от 250 ₽/шт" },
  { id: "renovation", label: "После ремонта", hint: "+40%" },
  { id: "high-access", label: "Труднодоступные окна", hint: "+35%" },
];

export const initialCalculatorState: CalculatorState = {
  object: null,
  windows: null,
  areaIndex: 2,
  sides: null,
  extras: [],
};

export const labelFor = {
  object: (id: ObjectType | null) => objectOptions.find((o) => o.id === id)?.label ?? "—",
  windows: (id: WindowType | null) => windowOptions.find((o) => o.id === id)?.label ?? "—",
  sides: (id: Sides | null) => sideOptions.find((o) => o.id === id)?.label ?? "—",
  extra: (id: ExtraId) => extraOptions.find((o) => o.id === id)?.label ?? id,
};
