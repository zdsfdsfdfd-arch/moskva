import Link from "next/link";
import { Klir } from "@/components/illustrations/Klir";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-3xl flex-col items-center justify-center px-6 pt-28 text-center">
      <div className="w-40">
        <Klir pose="stand" expression="surprised" track className="w-full" />
      </div>
      <p className="mt-6 font-hand text-2xl text-ink-mute">Тут даже стекла нет.</p>
      <h1 className="font-display mt-2 text-[clamp(32px,5vw,64px)] font-black leading-none tracking-[-0.03em] text-ink">404</h1>
      <p className="mt-4 max-w-md text-ink-soft">Такой страницы нет. Зато есть главная — с окном, которое можно помыть прямо сейчас.</p>
      <div className="mt-8">
        <Link href="/">
          <Button>На главную</Button>
        </Link>
      </div>
    </div>
  );
}
