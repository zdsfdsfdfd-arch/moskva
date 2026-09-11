import { Klir } from "@/components/illustrations/Klir";

/**
 * We have no real reviews yet, so we say so. Three empty bubbles hold
 * the place; nothing here pretends to be a customer.
 */
export function Reviews() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="grid items-center gap-8 rounded-[16px] ink-border bg-cream p-6 sm:p-10 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-mute">Отзывы</p>
            <h2 id="reviews-title" className="font-display text-[clamp(24px,3vw,40px)] font-black leading-tight tracking-[-0.03em] text-ink">
              Здесь будут реальные отзывы наших клиентов.
            </h2>
            <p className="mt-3 max-w-[56ch] text-ink-soft">
              Мы не публикуем выдуманные отзывы и рейтинги. Как только появятся настоящие — они будут тут, с именами, датами и без прилагательного «профессиональный» в каждом втором слове.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-3" aria-label="Место для отзывов">
              {["Отзыв №1", "Отзыв №2", "Отзыв №3"].map((t, i) => (
                <li
                  key={t}
                  className="relative min-h-[96px] rounded-[16px] rounded-bl-[4px] border-[3px] border-dashed border-ink/30 p-4 font-hand text-lg text-ink-mute"
                  style={{ transform: `rotate(${(i - 1) * 0.8}deg)` }}
                >
                  {t}
                  <span className="mt-1 block h-[3px] w-1/2 rounded-full bg-ink/10" />
                  <span className="mt-1 block h-[3px] w-1/3 rounded-full bg-ink/10" />
                </li>
              ))}
            </ul>
          </div>
          <div className="relative mx-auto w-40 lg:w-52">
            <div className="absolute -left-16 top-[42%] -rotate-6 whitespace-nowrap rounded-md ink-border-2 bg-sun px-2 py-1 font-hand text-base text-ink shadow-[0_2px_0_0_#1b1f2a]">
              Пока пусто. Честно.
            </div>
            <Klir pose="point" expression="smirk" flip track className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
