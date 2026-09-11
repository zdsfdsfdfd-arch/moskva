"use client";

import { useState } from "react";
import { City } from "@/components/illustrations/City";
import { Window } from "@/components/illustrations/Window";
import { Klir } from "@/components/illustrations/Klir";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { Button } from "@/components/ui/Button";
import { Sparkle } from "@/components/brand/Sparkle";
import { cta } from "@/data/nav";

const LINES = ["Наконец-то.", "Я ждал.", "Ну давай уже.", "Окна сами не помоются. Хотя…"];

/** Night. A huge clean window, a warm city, and Klir on the sill — waiting. */
export function FinalCta() {
  const [clicks, setClicks] = useState(0);
  const line = LINES[clicks % LINES.length];

  return (
    <section id="final" aria-labelledby="final-title" className="relative overflow-hidden bg-night py-20 text-cream sm:py-28">
      {/* stars in the wall? no — the room is dark, the city glows */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          <div className="relative z-10">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-cream/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cream/80">
              <Sparkle className="h-3.5 w-3.5" /> Последний шаг
            </p>
            <h2 id="final-title" className="font-display text-balance text-[clamp(34px,5vw,74px)] font-black leading-[0.98] tracking-[-0.03em] text-cream">
              Ну что. Пора увидеть город нормально.
            </h2>
            <p className="mt-5 max-w-[44ch] text-lg text-cream/70">
              Ориентировочный расчёт займёт минуту. Точную сумму назовём после короткого звонка.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={cta.primary.href} variant="night" size="lg">
                {cta.primary.label}
              </Button>
              <Button href={cta.services.href} variant="ghost-night" size="lg">
                {cta.services.label}
              </Button>
            </div>
          </div>

          <div className="relative">
            <Window cols={2} frame="night" sill frameWidth="clamp(12px, 1.8vw, 26px)">
              <div className="aspect-[4/3] sm:aspect-[16/10]">
                <City variant="night" seed={77} />
              </div>
            </Window>
            {/* Klir sits on the sill, looking at you */}
            <div className="absolute -bottom-3 left-[6%] w-[clamp(90px,13vw,170px)] sm:left-[8%]">
              <div className="absolute -top-12 left-[70%] whitespace-nowrap">
                <SpeechBubble key={line} tail="bottom-left" size="md">
                  {line}
                </SpeechBubble>
              </div>
              <button
                type="button"
                onClick={() => setClicks((c) => c + 1)}
                className="block w-full rounded-lg"
                aria-label="Клир. Нажмите — он что-нибудь скажет"
                data-cursor="card"
              >
                <Klir pose="sit" expression={clicks % 4 === 3 ? "wink" : "smirk"} track className="w-full" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
