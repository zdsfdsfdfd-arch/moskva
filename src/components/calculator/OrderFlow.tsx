"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Klir } from "@/components/illustrations/Klir";
import { Sparkle } from "@/components/brand/Sparkle";
import type { CalculatorState } from "@/data/calculator";
import { submitLead, type LeadResult } from "@/lib/leads/submitLead";
import type { LeadWhen } from "@/lib/leads/types";
import { formatPhone, isValidAddress, isValidDate, isValidPhone, normalizePhone } from "@/lib/leads/validate";
import { formatRub } from "@/lib/utils";
import { StepShell } from "./StepShell";
import { cn } from "@/lib/utils";

type Props = { state: CalculatorState; estimate: number; onBack: () => void };

type Status = "idle" | "loading" | "success" | "error";

const inputClass =
  "h-12 w-full rounded-[10px] bg-cream px-4 text-base text-ink ink-border-2 placeholder:text-ink-mute/70 focus:bg-white aria-[invalid=true]:border-tangerine-deep";

export function OrderFlow({ state, estimate, onBack }: Props) {
  const [address, setAddress] = useState("");
  const [whenType, setWhenType] = useState<LeadWhen["type"] | null>(null);
  const [date, setDate] = useState("");
  const [phone, setPhone] = useState("");
  const [touched, setTouched] = useState<{ address?: boolean; phone?: boolean; date?: boolean }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<LeadResult | null>(null);

  const addressOk = isValidAddress(address);
  const whenOk = whenType === "today" || whenType === "tomorrow" || (whenType === "date" && isValidDate(date));
  const phoneOk = isValidPhone(phone);
  const canSubmit = addressOk && whenOk && phoneOk && status !== "loading";

  const todayIso = new Date().toISOString().slice(0, 10);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ address: true, phone: true, date: true });
    if (!canSubmit) return;
    setStatus("loading");
    const when: LeadWhen = whenType === "date" ? { type: "date", date } : { type: whenType as "today" | "tomorrow" };
    const res = await submitLead({
      calculator: state,
      estimate,
      address: address.trim(),
      when,
      phone: normalizePhone(phone),
      source: "website",
      createdAt: new Date().toISOString(),
    });
    setResult(res);
    setStatus(res.ok ? "success" : "error");
  }

  if (status === "success" && result?.ok) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-[14px] ink-border bg-sky-pale p-6 sm:p-8"
        role="status"
        aria-live="polite"
      >
        {/* paper plane flies into the net */}
        <motion.svg
          aria-hidden
          viewBox="0 0 60 40"
          className="absolute left-0 top-6 w-14"
          initial={{ x: -80, y: 40, rotate: -20, opacity: 0 }}
          animate={{ x: ["-20%", "180%", "300%"], y: [40, -10, 10], rotate: [-20, 0, 25], opacity: [0, 1, 0] }}
          transition={{ duration: 1.4, ease: "easeInOut", delay: 0.2 }}
        >
          <path d="M2 20 L58 2 L38 38 L28 24 Z" fill="#fff9ee" stroke="#1b1f2a" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M28 24 L58 2" stroke="#1b1f2a" strokeWidth="2.5" />
        </motion.svg>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
          <div className="w-40 shrink-0">
            <Klir pose="catch" expression="happy" className="w-full" />
          </div>
          <div className="text-center sm:text-left">
            <p className="font-display text-3xl font-black tracking-tight text-ink">Заявка поймана.</p>
            <p className="mt-2 text-ink-soft">
              {result.mode === "live"
                ? "Перезвоним, уточним детали и назовём точную сумму."
                : "Форма работает в режиме демонстрации: заявка никуда не отправлена и сохранена только в этом браузере."}
            </p>
            <ul className="mt-4 space-y-1 text-sm text-ink-soft">
              <li>
                <b className="text-ink">Адрес:</b> {address}
              </li>
              <li>
                <b className="text-ink">Когда:</b> {whenType === "today" ? "сегодня" : whenType === "tomorrow" ? "завтра" : date}
              </li>
              <li>
                <b className="text-ink">Телефон:</b> {formatPhone(phone)}
              </li>
              <li>
                <b className="text-ink">Ориентир:</b> {formatRub(estimate, "≈ ")}
              </li>
            </ul>
            <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
              <Button variant="secondary" onClick={() => { setStatus("idle"); setResult(null); setAddress(""); setPhone(""); setWhenType(null); setDate(""); setTouched({}); }}>
                Ещё одна заявка
              </Button>
            </div>
          </div>
        </div>
        <Sparkle animate="pop" className="absolute right-6 top-6 w-8" />
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <StepShell index={6} title="Куда приехать?" done={addressOk}>
        <label className="block">
          <span className="sr-only">Адрес</span>
          <input
            type="text"
            autoComplete="street-address"
            placeholder="Улица и дом — этого достаточно"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, address: true }))}
            aria-invalid={touched.address && !addressOk ? true : undefined}
            aria-describedby="address-hint"
            className={inputClass}
          />
        </label>
        <p id="address-hint" className={cn("mt-2 text-sm", touched.address && !addressOk ? "text-tangerine-deep" : "text-ink-mute")}>
          {touched.address && !addressOk ? "Нужен хотя бы адрес улицы и дома." : "Москва и область. Район влияет на минимальную сумму заказа."}
        </p>
      </StepShell>

      <StepShell index={7} title="Когда удобно?" done={whenOk} muted={!addressOk}>
        <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Когда удобно">
          {(
            [
              ["today", "Сегодня"],
              ["tomorrow", "Завтра"],
              ["date", "Выбрать дату"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={whenType === id}
              onClick={() => setWhenType(id)}
              data-cursor="button"
              className={cn(
                "h-11 rounded-full px-5 font-semibold ink-border-2 transition-colors",
                whenType === id ? "bg-sun shadow-[0_3px_0_0_#1b1f2a]" : "bg-cream hover:bg-white",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <AnimatePresence>
          {whenType === "date" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <label className="mt-3 block">
                <span className="sr-only">Дата</span>
                <input
                  type="date"
                  min={todayIso}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, date: true }))}
                  aria-invalid={touched.date && whenType === "date" && !isValidDate(date) ? true : undefined}
                  className={cn(inputClass, "max-w-xs")}
                />
              </label>
            </motion.div>
          )}
        </AnimatePresence>
        <p className="mt-2 text-sm text-ink-mute">Дату и время подтверждаем по телефону — сразу же, без «мы вам перезвоним когда-нибудь».</p>
      </StepShell>

      <StepShell index={8} title="Куда отправить подтверждение?" done={phoneOk} muted={!whenOk}>
        <label className="block">
          <span className="sr-only">Телефон</span>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 (___) ___-__-__"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
            aria-invalid={touched.phone && !phoneOk ? true : undefined}
            aria-describedby="phone-hint"
            className={cn(inputClass, "max-w-xs font-mono tracking-wide")}
          />
        </label>
        <p id="phone-hint" className={cn("mt-2 text-sm", touched.phone && !phoneOk ? "text-tangerine-deep" : "text-ink-mute")}>
          {touched.phone && !phoneOk ? "Нужен мобильный номер из 10 цифр, начинается с 9." : "Нажимая кнопку, вы соглашаетесь с обработкой персональных данных."}
        </p>

        {status === "error" && (
          <p role="alert" className="mt-3 rounded-[10px] bg-tangerine/15 px-3 py-2 text-sm text-tangerine-deep ink-border-2">
            {result && !result.ok ? result.error : "Что-то пошло не так. Попробуйте ещё раз."}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button type="submit" size="lg" loading={status === "loading"} disabled={!canSubmit && status !== "loading"}>
            Получить расчёт
          </Button>
          <Button type="button" variant="ghost" onClick={onBack}>
            Назад к расчёту
          </Button>
        </div>
      </StepShell>
    </form>
  );
}
