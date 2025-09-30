export type Device = "pc" | "laptop" | "mobile";

export const DEFAULT_PRICES: Record<Device, Record<string, number>> = {
  mobile: { diagnostic: 60, screen: 120, battery: 120},
  laptop: { diagnostic: 60, osreinstall: 100, screen: 120, battery: 60, malware: 80, upgrade: 80},
  pc:     { diagnostic: 60, osreinstall: 100, malware: 80, upgrade: 80},
};

export function pricesFor(device: Device, serviceKey: string, manualHours?: number) {
  if (serviceKey === "manual") return Math.max(0, manualHours || 0);
  return DEFAULT_PRICES[device]?.[serviceKey] ?? 0;
}
