import type { Lead } from "./types";

export const PHONE_DIGITS = 10;

/** Keeps only the 10 national digits (drops a leading 7/8). */
export function normalizePhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) digits = digits.slice(1);
  return digits.slice(0, PHONE_DIGITS);
}

/** +7 (999) 123-45-67 as you type. */
export function formatPhone(raw: string): string {
  const d = normalizePhone(raw);
  if (!d) return "";
  let out = "+7";
  if (d.length > 0) out += ` (${d.slice(0, 3)}`;
  if (d.length >= 3) out += ")";
  if (d.length > 3) out += ` ${d.slice(3, 6)}`;
  if (d.length > 6) out += `-${d.slice(6, 8)}`;
  if (d.length > 8) out += `-${d.slice(8, 10)}`;
  return out;
}

export function isValidPhone(raw: string): boolean {
  const d = normalizePhone(raw);
  return d.length === PHONE_DIGITS && d[0] === "9";
}

export function isValidAddress(raw: string): boolean {
  return raw.trim().length >= 5;
}

export function isValidDate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d.getTime() >= today.getTime();
}

/** Server-side shape check for the API route. Returns an error string or null. */
export function validateLead(body: unknown): { lead: Lead } | { error: string } {
  if (!body || typeof body !== "object") return { error: "Пустой запрос" };
  const b = body as Record<string, unknown>;
  if (typeof b.address !== "string" || !isValidAddress(b.address)) return { error: "Укажите адрес" };
  if (typeof b.phone !== "string" || !isValidPhone(b.phone)) return { error: "Проверьте номер телефона" };
  const when = b.when as Lead["when"] | undefined;
  if (!when || !["today", "tomorrow", "date"].includes(when.type)) return { error: "Укажите время" };
  if (when.type === "date" && !isValidDate(when.date)) return { error: "Проверьте дату" };
  if (typeof b.estimate !== "number" || !Number.isFinite(b.estimate)) return { error: "Нет расчёта" };
  const calculator = b.calculator as Lead["calculator"] | undefined;
  if (!calculator || typeof calculator !== "object") return { error: "Нет параметров расчёта" };
  return {
    lead: {
      calculator,
      estimate: b.estimate,
      address: b.address.trim().slice(0, 300),
      when,
      phone: normalizePhone(b.phone),
      source: "website",
      createdAt: typeof b.createdAt === "string" ? b.createdAt : new Date().toISOString(),
    },
  };
}
