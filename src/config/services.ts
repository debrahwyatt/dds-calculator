import type { Device } from "../engine/prices";

export type ServiceKey =
  | "diagnostic" | "osreinstall" | "screen" | "battery" | "hardware"
  | "datarecovery" | "backglass" | "malware" | "upgrade" | "swtroubleshoot" | "manual";

export type AddonKey = "screenprotector" | "backup" | "case" | "tuneup" | "cleaning" | "cooling" | "manualAddon" | "none";

export interface OptionMeta {
  key: string;
  label: string;
  devices: Device[];
  requiresPart?: boolean;
  defaultPart?: Partial<Record<Device, number>> | number;
  defaultPrice?: Partial<Record<Device, number>> | number; // NEW: service/add-on fee
}

// Example defaults (tweak to taste)
export const SERVICES: OptionMeta[] = [
  { key: "diagnostic", label: "Diagnostic Assessment", devices: ["pc","laptop","mobile"], defaultPrice: 60 },
  { key: "osreinstall", label: "OS Recovery/Reinstall", devices: ["pc","laptop"], defaultPrice: 100 },
  { key: "screen", label: "Screen Replacement", devices: ["laptop","mobile"], requiresPart: true, defaultPart: { mobile:75, laptop:140 }, defaultPrice: 120 },
  { key: "battery", label: "Battery Replacement", devices: ["laptop","mobile"], requiresPart: true, defaultPart: { mobile:45, laptop:80 }, defaultPrice: 120 },
  { key: "hardware", label: "Hardware Repair", devices: ["pc","laptop","mobile"], defaultPrice: 90 },
  { key: "datarecovery", label: "Data Recovery", devices: ["pc","laptop","mobile"], defaultPrice: 150 },
  { key: "backglass", label: "Back Glass Replacement", devices: ["mobile"], requiresPart: true, defaultPart: 40, defaultPrice: 50 },
  { key: "malware", label: "Virus/Malware Removal", devices: ["pc","laptop"], defaultPrice: 75 },
  { key: "upgrade", label: "System Upgrade", devices: ["pc","laptop"], defaultPrice: 60 },
  { key: "swtroubleshoot", label: "Software Troubleshooting", devices: ["pc","laptop","mobile"], defaultPrice: 55 },
  // 'manual' no longer needed when not using hours; remove it from the list if you like
];

export const ADDONS: OptionMeta[] = [
  { key: "screenprotector", label: "Screen Protector", devices: ["mobile"], requiresPart: true, defaultPart: 15, defaultPrice: 0 },
  { key: "backup",          label: "Data Backup/Transfer", devices: ["pc","laptop","mobile"], defaultPrice: 40 },
  { key: "case",            label: "Protective Case", devices: ["mobile"], requiresPart: true, defaultPart: 20, defaultPrice: 0 },
  { key: "tuneup",          label: "Device Tune-up", devices: ["pc","laptop"], defaultPrice: 35 },
  { key: "cleaning",        label: "Device Cleaning", devices: ["pc","laptop","mobile"], defaultPrice: 20 },
  { key: "cooling",         label: "Cooling Service", devices: ["pc","laptop"], defaultPrice: 30 },
];


// Helper to resolve default part number for a device
export function defaultPartFor(meta: OptionMeta, device: Device): number {
  const d = meta.defaultPart;
  if (!d) return 0;
  if (typeof d === "number") return d;
  return d[device] ?? 0;
}

export function defaultPriceFor(meta: OptionMeta, device: Device): number {
  const d = meta.defaultPrice;
  if (!d) return 0;
  if (typeof d === "number") return d;
  return d[device] ?? 0;
}
