import type { Lead, LeadProvider, LeadResult } from "./types";
import { withBasePath } from "@/lib/basePath";

/** Статический экспорт (GitHub Pages): серверных маршрутов нет вообще. */
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

/**
 * Единая точка отправки заявки. Интерфейс не меняется, когда появится
 * реальный backend: подключите Telegram / CRM / email в /api/lead
 * (см. src/app/api/lead/route.ts) или замените провайдера здесь.
 */
const apiProvider: LeadProvider = {
  async submit(lead) {
    const res = await fetch(withBasePath("/api/lead"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
    const data = (await res.json().catch(() => null)) as LeadResult | null;
    if (!res.ok || !data) return { ok: false, error: data && "error" in data ? data.error : "Не удалось отправить заявку" };
    return data;
  },
};

/**
 * Запасной вариант: заявка остаётся только в этом браузере.
 * Используется на статическом хостинге и если сеть недоступна.
 * Пользователю показывается честное «режим демонстрации».
 */
const localProvider: LeadProvider = {
  async submit(lead) {
    const id = `local-${Date.now().toString(36)}`;
    try {
      const key = "blik:leads";
      const prev = JSON.parse(localStorage.getItem(key) || "[]") as unknown[];
      localStorage.setItem(key, JSON.stringify([...prev, { id, ...lead }].slice(-20)));
    } catch {
      /* storage unavailable — still a demo, still fine */
    }
    return { ok: true, mode: "demo", id };
  },
};

export async function submitLead(lead: Lead): Promise<LeadResult> {
  // На статике маршрута /api/lead не существует: запрос вернул бы 404,
  // а пользователь увидел бы ошибку вместо честного демо-режима.
  if (isStaticExport) return localProvider.submit(lead);
  try {
    return await apiProvider.submit(lead);
  } catch {
    return localProvider.submit(lead);
  }
}

export type { Lead, LeadResult };
