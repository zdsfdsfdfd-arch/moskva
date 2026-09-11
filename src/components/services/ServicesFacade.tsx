"use client";

import { services, type Service } from "@/data/services";
import { pushPreset } from "@/lib/presetBus";
import { cn } from "@/lib/utils";
import { Pigeon } from "@/components/illustrations/City";
import { ServiceScene } from "./ServiceScenes";

const SPANS: Record<Service["id"], string> = {
  panoramic: "sm:col-span-2 lg:col-span-7 lg:row-span-2",
  "high-access": "lg:col-span-5",
  mosquito: "lg:col-span-5",
  apartment: "lg:col-span-4",
  balcony: "lg:col-span-4",
  renovation: "lg:col-span-4",
  office: "lg:col-span-6",
  storefront: "sm:col-span-2 lg:col-span-6",
};

const SCENE_H: Record<Service["id"], string> = {
  panoramic: "min-h-[240px] sm:min-h-[300px] lg:min-h-0 lg:flex-1",
  "high-access": "min-h-[170px]",
  mosquito: "min-h-[170px]",
  apartment: "min-h-[180px]",
  balcony: "min-h-[180px]",
  renovation: "min-h-[180px]",
  office: "min-h-[170px]",
  storefront: "min-h-[190px]",
};

const ORDER: Service["id"][] = ["panoramic", "high-access", "mosquito", "apartment", "balcony", "renovation", "office", "storefront"];

function ServiceWindow({ service }: { service: Service }) {
  return (
    <article
      id={`service-${service.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[8px] ink-border bg-cream shadow-[inset_0_-5px_0_0_#e8dfcf] transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 focus-within:-translate-y-1",
        SPANS[service.id],
      )}
    >
      <a
        href="#calculator"
        onClick={() => pushPreset(service.preset)}
        className="flex h-full flex-col outline-none"
        data-cursor="card"
        aria-label={`${service.title}: ${service.priceHint}. Рассчитать стоимость`}
      >
        <div className={cn("relative m-[clamp(6px,0.9vw,12px)] mb-0 overflow-hidden rounded-[5px] ink-border-2 bg-sky", SCENE_H[service.id])}>
          <ServiceScene id={service.id} />
        </div>
        {/* plate under the window */}
        <div className="px-[clamp(10px,1.2vw,18px)] py-3">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-[15px] font-bold leading-tight text-ink sm:text-base">{service.title}</h3>
            <span className="shrink-0 whitespace-nowrap rounded-full bg-sun px-2 py-0.5 text-[11px] font-semibold text-ink ink-border-2 sm:text-xs">
              {service.priceHint}
            </span>
          </div>
          <p className="mt-1.5 text-[13px] leading-snug text-ink-soft sm:text-sm">{service.description}</p>
          <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-teal-deep transition-transform duration-300 group-hover:translate-x-1">
            Рассчитать <span aria-hidden>→</span>
          </span>
        </div>
      </a>
    </article>
  );
}

/**
 * Services as windows on one building. Panoramic wall top-left, the
 * high-access window under the roof, the storefront on the ground floor.
 * On phones the facade becomes a tower.
 */
export function ServicesFacade() {
  return (
    <section id="services" aria-labelledby="services-title" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="relative">
          {/* rooftop: billboard with the heading, antennas, pigeons */}
          <div className="relative z-10 mx-[3%] flex items-end gap-6">
            <div className="relative">
              <div className="relative rounded-[8px] ink-border bg-ink px-5 py-4 text-cream shadow-[0_6px_0_0_#1b1f2a] sm:px-8 sm:py-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sun">Услуги</p>
                <h2 id="services-title" className="font-display mt-1 text-[clamp(26px,3.6vw,48px)] font-black leading-none tracking-[-0.03em]">
                  Что будем отмывать?
                </h2>
                <p className="mt-2 max-w-[44ch] text-sm text-cream/75 sm:text-base">
                  Восемь типов стекла, которые моем чаще всего. Наведите на окно — оно покажет, как это выглядит.
                </p>
                {/* billboard lamps */}
                <span aria-hidden className="absolute -top-2 left-6 h-3 w-8 rounded-full bg-sun ink-border-2" />
                <span aria-hidden className="absolute -top-2 right-6 h-3 w-8 rounded-full bg-sun ink-border-2" />
              </div>
              {/* posts */}
              <div aria-hidden className="mx-8 flex justify-between">
                <span className="h-6 w-2.5 bg-ink" />
                <span className="h-6 w-2.5 bg-ink" />
              </div>
            </div>
            <svg aria-hidden viewBox="0 0 220 90" className="mb-0 hidden w-48 shrink-0 md:block">
              <path d="M40 90 V20 M28 32 h24 M32 46 h16" stroke="#1b1f2a" strokeWidth="4" strokeLinecap="round" />
              <path d="M90 90 q60 8 120 0" stroke="#1b1f2a" strokeWidth="3" fill="none" />
              <Pigeon x={130} y={90} />
              <Pigeon x={175} y={92} />
            </svg>
          </div>

          {/* the facade */}
          <div className="relative rounded-[14px] ink-border bg-sand p-[clamp(10px,1.6vw,22px)] shadow-[0_40px_60px_-40px_rgba(27,31,42,0.55)] [background-image:repeating-linear-gradient(0deg,transparent_0_44px,rgba(27,31,42,0.08)_44px_46px),repeating-linear-gradient(90deg,transparent_0_120px,rgba(27,31,42,0.06)_120px_122px)]">
            {/* drainpipes */}
            <span aria-hidden className="absolute -left-[3px] top-[8%] hidden h-[84%] w-3 rounded-full bg-[#d5dde6] ring-[3px] ring-ink lg:block" />
            <span aria-hidden className="absolute -right-[3px] top-[8%] hidden h-[84%] w-3 rounded-full bg-[#d5dde6] ring-[3px] ring-ink lg:block" />

            <div className="grid grid-cols-1 gap-[clamp(8px,1.4vw,18px)] sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[minmax(200px,auto)]">
              {ORDER.map((id) => {
                const s = services.find((x) => x.id === id)!;
                return <ServiceWindow key={id} service={s} />;
              })}
            </div>

            {/* entrance */}
            <div aria-hidden className="mt-[clamp(8px,1.4vw,18px)] flex items-end justify-between px-2">
              <div className="flex items-end gap-3">
                <div className="h-14 w-10 rounded-t-[14px] ink-border bg-tangerine-deep">
                  <span className="mt-6 ml-6 block h-1.5 w-1.5 rounded-full bg-sun" />
                </div>
                <span className="mb-1 rounded-sm ink-border-2 bg-cream px-2 py-0.5 font-hand text-sm">подъезд 1</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="h-7 w-9 rounded-t-full bg-teal ink-border-2" />
                <span className="h-9 w-11 rounded-t-full bg-teal-deep ink-border-2" />
                <span className="h-6 w-8 rounded-t-full bg-teal ink-border-2" />
              </div>
            </div>
          </div>
          {/* pavement */}
          <div aria-hidden className="mx-[-1%] h-5 rounded-b-[10px] ink-border border-t-0 bg-sand-deep" />
        </div>
      </div>
    </section>
  );
}
