import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { priceDisclaimer, priceGroups, priceNote } from "@/data/prices";
import { cta } from "@/data/nav";
import { City } from "@/components/illustrations/City";

/**
 * Prices as a paper list taped inside a shop window — the way real
 * storefronts do it. Hover a row and a squeegee stripe sweeps across.
 */
export function Prices() {
  return (
    <section id="prices" aria-labelledby="prices-title" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              id="prices-title"
              eyebrow="Цены"
              title="Сколько это стоит?"
              lede="Ориентиры, от которых мы считаем. Заклеены на витрине, как положено. Точную сумму подтверждаем после уточнения деталей."
            />
            <p className="mt-6 max-w-[48ch] text-sm leading-relaxed text-ink-mute">{priceDisclaimer}</p>
            <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-ink-mute">{priceNote}</p>
            <div className="mt-8">
              <Button href={cta.primary.href} size="lg">
                {cta.primary.label}
              </Button>
            </div>
          </div>

          {/* the storefront */}
          <div className="relative">
            {/* awning */}
            <div aria-hidden className="relative z-10 mx-[2%] h-8 overflow-hidden rounded-t-[10px] ink-border border-b-0 bg-[repeating-linear-gradient(90deg,#ff6b2c_0_28px,#fff9ee_28px_56px)]" />
            <div aria-hidden className="relative z-10 mx-[1%] h-3 rounded-b-[4px] ink-border border-t-0 bg-tangerine-deep" />
            <div className="relative rounded-[12px] ink-border bg-[#3a4152] p-[clamp(10px,1.4vw,18px)] shadow-[0_30px_50px_-30px_rgba(27,31,42,0.6)]">
              <div className="relative overflow-hidden rounded-[6px] ink-border bg-sky">
                {/* a faint city outside for depth */}
                <div aria-hidden className="absolute inset-0 opacity-60">
                  <City variant="day" seed={4} lite celestial={false} />
                </div>
                <div aria-hidden className="absolute inset-0 bg-sky-pale/55" />
                {/* gleam */}
                <div aria-hidden className="pointer-events-none absolute -left-[8%] top-0 h-full w-[12%] -skew-x-[18deg] bg-white/30" />

                {/* open sign */}
                <div aria-hidden className="absolute right-4 top-3 z-20 rotate-3 rounded-md ink-border-2 bg-sun px-2.5 py-1 font-hand text-sm text-ink shadow-[0_2px_0_0_#1b1f2a]">
                  ОТКРЫТО
                </div>

                {/* the paper list, taped to the glass */}
                <div className="relative z-10 p-4 sm:p-8">
                  <div className="relative -rotate-[0.6deg] rounded-[4px] bg-cream px-5 py-6 shadow-[0_2px_0_0_#1b1f2a,0_18px_30px_-20px_rgba(27,31,42,0.5)] ink-border-2 sm:px-8 sm:py-8">
                    {/* tape */}
                    <Tape className="-left-3 -top-3 -rotate-[24deg]" />
                    <Tape className="-right-3 -top-3 rotate-[22deg]" />
                    <Tape className="-bottom-3 -left-3 rotate-[18deg]" />
                    <Tape className="-bottom-3 -right-3 -rotate-[20deg]" />

                    <p className="font-hand text-2xl text-ink">Прайс. Ориентировочный.</p>

                    <div className="mt-4 grid gap-6 sm:grid-cols-2 sm:gap-x-10">
                      {priceGroups.map((group, gi) => (
                        <div key={group.title} className={gi === 0 ? "sm:row-span-2" : ""}>
                          <h3 className="font-display text-sm font-bold uppercase tracking-[0.12em] text-ink">{group.title}</h3>
                          <p className="text-xs text-ink-mute">{group.hint}</p>
                          <ul className="mt-3 divide-y-2 divide-dashed divide-ink/15">
                            {group.rows.map((row) => (
                              <li key={row.name} className="group/row relative overflow-hidden py-2.5" data-cursor="wash">
                                {/* squeegee stripe on hover */}
                                <span
                                  aria-hidden
                                  className="pointer-events-none absolute inset-y-0 -left-full w-full bg-gradient-to-r from-transparent via-sky/70 to-transparent transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover/row:translate-x-[200%]"
                                />
                                <div className="relative flex items-baseline justify-between gap-3">
                                  <span className="font-medium text-ink">
                                    {row.name}
                                    {row.note && <span className="ml-1 text-xs text-ink-mute">{row.note}</span>}
                                  </span>
                                  <span className="shrink-0 whitespace-nowrap font-display text-sm font-bold text-ink sm:text-base">{row.price}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* pavement */}
            <div aria-hidden className="mx-[-2%] h-4 rounded-b-[8px] ink-border border-t-0 bg-sand-deep" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Tape({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`absolute h-5 w-14 bg-sun/80 ink-border-2 ${className}`}
      style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.35) 0 4px, transparent 4px 9px)" }}
    />
  );
}
