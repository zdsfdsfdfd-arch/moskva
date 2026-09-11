import Link from "next/link";
import { brand } from "@/data/brand";
import { navItems } from "@/data/nav";
import { services } from "@/data/services";
import { LogoMark } from "@/components/brand/Logo";
import { Klir } from "@/components/illustrations/Klir";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-night-deep text-cream">
      <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-16 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark night className="h-10 w-10" />
              <span className="font-display text-2xl font-black">{brand.name}</span>
            </div>
            <p className="mt-4 max-w-xs text-cream/70">
              {brand.descriptor} Квартиры, панорамы, балконы, витрины, офисы — по Москве и области.
            </p>
            <p className="mt-6 text-sm text-cream/45">{brand.demoNotice}</p>
          </div>

          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-cream/50">Разделы</h2>
            <ul className="mt-4 space-y-2">
              {navItems.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-cream/85 hover:text-sun" data-cursor="button">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#calculator" className="text-cream/85 hover:text-sun" data-cursor="button">
                  Калькулятор
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-cream/50">Услуги</h2>
            <ul className="mt-4 space-y-2">
              {services.map((s) => (
                <li key={s.id}>
                  <a href={`#service-${s.id}`} className="text-cream/85 hover:text-sun" data-cursor="button">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-cream/50">Контакты</h2>
            <ul className="mt-4 space-y-2 text-cream/85">
              <li>
                <span className="font-mono tracking-wide">{brand.contacts.phoneDisplay}</span>
                <p className="mt-1 text-sm text-cream/45">{brand.contacts.phoneNote}</p>
              </li>
              <li>{brand.contacts.hours}</li>
              <li>{brand.contacts.address}</li>
            </ul>
            <ul className="mt-6 space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-cream/70 underline-offset-4 hover:text-sun hover:underline">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/consent" className="text-cream/70 underline-offset-4 hover:text-sun hover:underline">
                  Согласие на обработку персональных данных
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant wordmark with Klir sitting on the Б */}
        <div className="relative mt-16 select-none">
          <div className="absolute -top-2 left-[1%] w-[clamp(64px,7vw,110px)] sm:-top-6" aria-hidden>
            <Klir pose="sit" expression="wink" track idle={false} className="w-full" />
          </div>
          <p
            aria-hidden
            className="font-display text-[clamp(72px,17vw,260px)] font-black leading-[0.85] tracking-[-0.04em] text-cream/10"
          >
            {brand.name}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-cream/10 pt-6 text-sm text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {brand.name}. Демонстрационный сайт.</p>
          <p>Москва и Московская область</p>
        </div>
      </div>
    </footer>
  );
}
