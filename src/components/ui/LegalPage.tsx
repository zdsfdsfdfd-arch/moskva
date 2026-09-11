import type { ReactNode } from "react";
import Link from "next/link";
import { brand } from "@/data/brand";

type Props = { title: string; updated: string; children: ReactNode };

/** Plain, readable legal page. Same ink-outline language, no decoration. */
export function LegalPage({ title, updated, children }: Props) {
  return (
    <article className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-mute">{brand.name}</p>
      <h1 className="font-display mt-2 text-[clamp(28px,4vw,48px)] font-black leading-tight tracking-[-0.03em] text-ink">{title}</h1>
      <p className="mt-2 text-sm text-ink-mute">Обновлено: {updated}</p>
      <div className="prose-blik mt-8 space-y-4 text-[17px] leading-relaxed text-ink-soft [&_h2]:font-display [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1">
        <p className="rounded-[10px] bg-sun/30 px-4 py-3 text-sm text-ink ink-border-2">{brand.demoNotice}</p>
        {children}
      </div>
      <p className="mt-10">
        <Link href="/" className="font-semibold text-teal-deep underline-offset-4 hover:underline">
          ← На главную
        </Link>
      </p>
    </article>
  );
}
