import type { CalculatorState } from "@/data/calculator";

export type LeadWhen =
  | { type: "today" }
  | { type: "tomorrow" }
  | { type: "date"; date: string };

export type Lead = {
  calculator: CalculatorState;
  estimate: number;
  address: string;
  when: LeadWhen;
  phone: string;
  source: "website";
  createdAt: string;
};

export type LeadResult =
  | { ok: true; mode: "demo" | "live"; id: string }
  | { ok: false; error: string };

export interface LeadProvider {
  submit(lead: Lead): Promise<LeadResult>;
}
