export type Device = "pc" | "laptop" | "mobile";

export const DEFAULT_PRICES: Record<Device, Record<string, number>> = {
  mobile: { diagnostic: 60, datarecovery: 150, hardware: 90, swtroubleshoot: 55, backglass: 90, screen: 120, battery: 120, screenprotector: 10, backup: 40, tuneup: 60, cleaning: 20},
  laptop: { diagnostic: 60, datarecovery: 150, hardware: 90, swtroubleshoot: 55, osreinstall: 100, screen: 120, battery: 60, malware: 80, upgrade: 80, backup: 40, tuneup: 60, cleaning:40, cooling: 30},
  pc:     { diagnostic: 60, datarecovery: 150, hardware: 90, swtroubleshoot: 55, osreinstall: 100, malware: 80, upgrade: 80, backup: 40, tuneup: 60, cleaning:40, cooling: 30},
};

export function pricesFor(device: Device, serviceKey: string, manualHours?: number) {
  if (serviceKey === "manual") return Math.max(0, manualHours || 0);
  return DEFAULT_PRICES[device]?.[serviceKey] ?? 0;
}
