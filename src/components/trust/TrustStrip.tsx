import { Squeegee } from "@/components/illustrations/Squeegee";
import { Drop } from "@/components/illustrations/Props";

const facts = [
  "Без разводов",
  "Выезд по Москве и области",
  "Профессиональная химия",
  "Ориентировочный расчёт за минуту",
  "Квартиры",
  "Дома",
  "Офисы",
  "Витрины",
  "Панорамное остекление",
  "Работаем и зимой — на спецсоставах",
  "Своё оборудование и штанги",
];

/**
 * A slanted strip of facts pushed along by a squeegee. No ratings —
 * we don't have real ones yet, so we don't print any.
 */
export function TrustStrip() {
  const items = [...facts, ...facts];
  return (
    <section aria-label="Коротко о нас" className="relative -mt-1 overflow-hidden py-10 sm:py-14">
      <div className="marquee relative -rotate-[1.5deg] scale-[1.02] border-y-[3px] border-ink bg-sun">
        <div
          className="marquee-track flex w-max items-center gap-8 whitespace-nowrap py-3.5 pl-20 font-display text-base font-bold tracking-tight text-ink sm:gap-10 sm:text-lg"
          style={{ ["--marquee-duration" as string]: "48s" }}
        >
          {items.map((f, i) => (
            <span key={i} className="flex items-center gap-8 sm:gap-10">
              {f}
              <Drop className="w-3.5 shrink-0" color="#a9e4f7" aria-hidden />
            </span>
          ))}
        </div>
        {/* the squeegee pushing from the left edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-2 top-1/2 h-[64px] w-[40px] -translate-y-1/2 -rotate-90 sm:h-[76px] sm:w-[46px]"
        >
          <Squeegee className="h-full w-full drop-shadow-[0_3px_0_rgba(27,31,42,0.25)]" grip="#ff6b2c" />
        </div>
      </div>
    </section>
  );
}
