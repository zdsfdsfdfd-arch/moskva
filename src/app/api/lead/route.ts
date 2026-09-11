import { NextResponse } from "next/server";
import { validateLead } from "@/lib/leads/validate";
import type { Lead, LeadResult } from "@/lib/leads/types";

export const runtime = "nodejs";

/**
 * Приём заявок. Без настроенных переменных окружения работает в
 * демо-режиме: ничего никуда не уходит, клиент получает mode: "demo".
 *
 * Подключение реального канала — одна из опций:
 *   LEAD_WEBHOOK_URL       — любой webhook (CRM, n8n, Make, Zapier)
 *   TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID — сообщение в Telegram
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" } satisfies LeadResult, { status: 400 });
  }

  const checked = validateLead(body);
  if ("error" in checked) {
    return NextResponse.json({ ok: false, error: checked.error } satisfies LeadResult, { status: 422 });
  }

  const lead = checked.lead;
  const id = `lead-${Date.now().toString(36)}`;

  const webhook = process.env.LEAD_WEBHOOK_URL;
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID;

  if (!webhook && !(tgToken && tgChat)) {
    // Demo mode: nothing configured. Log server-side, tell the client honestly.
    console.info("[lead:demo]", id, summarize(lead));
    return NextResponse.json({ ok: true, mode: "demo", id } satisfies LeadResult);
  }

  try {
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...lead }),
      });
      if (!res.ok) throw new Error(`webhook ${res.status}`);
    }
    if (tgToken && tgChat) {
      const res = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: tgChat, text: summarize(lead), parse_mode: "HTML" }),
      });
      if (!res.ok) throw new Error(`telegram ${res.status}`);
    }
    return NextResponse.json({ ok: true, mode: "live", id } satisfies LeadResult);
  } catch (err) {
    console.error("[lead:error]", id, err);
    return NextResponse.json({ ok: false, error: "Не удалось передать заявку. Попробуйте ещё раз." } satisfies LeadResult, { status: 502 });
  }
}

function summarize(lead: Lead): string {
  const when =
    lead.when.type === "today" ? "сегодня" : lead.when.type === "tomorrow" ? "завтра" : lead.when.date;
  const c = lead.calculator;
  return [
    "<b>Новая заявка — БЛИК</b>",
    `Объект: ${c.object ?? "—"}, окна: ${c.windows ?? "—"}, площадь: индекс ${c.areaIndex}, стороны: ${c.sides ?? "—"}`,
    `Доп. работы: ${c.extras.length ? c.extras.join(", ") : "нет"}`,
    `Оценка: ≈ ${lead.estimate} ₽`,
    `Адрес: ${lead.address}`,
    `Когда: ${when}`,
    `Телефон: +7${lead.phone}`,
  ].join("\n");
}
