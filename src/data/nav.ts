export type NavItem = { label: string; href: string };

export const navItems: NavItem[] = [
  { label: "Услуги", href: "#services" },
  { label: "Как работаем", href: "#process" },
  { label: "Цены", href: "#prices" },
  { label: "Работы", href: "#portfolio" },
  { label: "FAQ", href: "#faq" },
];

export const cta = {
  primary: { label: "Рассчитать стоимость", href: "#calculator" },
  services: { label: "Посмотреть услуги", href: "#services" },
  exact: { label: "Получить точный расчёт", href: "#calculator" },
  lead: { label: "Оставить заявку", href: "#calculator" },
} as const;
