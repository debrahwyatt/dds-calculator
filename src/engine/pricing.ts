import { hoursFor } from "./hours";
import type { Device } from "./hours";

export const GST_RATE = 0.05 as const;
export const LABOR_RATE = 80 as const;
export const SHIPPING_FLAT = 10 as const;

export function round2(n: number) { return Math.round(n * 100) / 100; }
export function money(n: number, currency: string = "CAD") {
  return n.toLocaleString(undefined, { style: "currency", currency });
}

export function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
export function fmtDate(d: Date) {
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}
export function etaRangeFromToday() {
  // parts 7–10 days + 2 days service → 9–12 from today
  const now = new Date();
  return { start: addDays(now, 9), end: addDays(now, 12) };
}

export function computeTotals(params: {
  device: Device;
  serviceKey: string;
  manualHours?: number;
  servicePart?: number;
  addonPart?: number;
}) {
  const hours = hoursFor(params.device, params.serviceKey, params.manualHours);
  const labor = hours * LABOR_RATE;
  const parts = (params.servicePart || 0) + (params.addonPart || 0);
  const shipping = parts > 0 ? SHIPPING_FLAT : 0;
  const subtotal = parts + labor + shipping;
  const gst = subtotal * GST_RATE;
  const grand = subtotal + gst;
  return { hours, labor, parts, shipping, subtotal, gst, grand };
}
