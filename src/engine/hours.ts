export type Device = "pc" | "laptop" | "mobile";

export const DEFAULT_HOURS: Record<Device, Record<string, number>> = {
  mobile: { battery: 1.5, screen: 1.5, chargeport: 1.25, board: 2.5, water: 3.0, diagnostic: .5 },
  laptop: { battery: 1.0, screen: 1.5, chargeport: 2.0,  board: 3.0, water: 3.0, diagnostic: .5 },
  pc:     { battery: .25, screen: .5,  chargeport: 1.0,  board: 2.0, water: 2.0, diagnostic: .5 },
};

export function hoursFor(device: Device, serviceKey: string, manualHours?: number) {
  if (serviceKey === "manual") return Math.max(0, manualHours || 0);
  return DEFAULT_HOURS[device]?.[serviceKey] ?? 0;
}
