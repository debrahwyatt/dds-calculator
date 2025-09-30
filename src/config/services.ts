import type { Device } from "../engine/hours";

export type ServiceKey =
  | "diagnostic" | "osreinstall" | "screen" | "battery" | "hardware"
  | "datarecovery" | "backglass" | "malware" | "upgrade" | "swtroubleshoot" | "manual";

export type AddonKey = "screenprotector" | "backup" | "case" | "tuneup" | "cleaning" | "cooling" | "manualAddon" | "none";

export interface OptionMeta {
  key: string;
  label: string;
  devices: Device[];
  requiresPart?: boolean;
  defaultPart?: Partial<Record<Device, number>> | number; // allow per-device defaults or a single number
}

export const SERVICES: OptionMeta[] = [
  { key: "diagnostic", label: "Diagnostic Assessment", devices: ["pc","laptop","mobile"] },
  { key: "osreinstall", label: "OS Recovery/Reinstall", devices: ["pc","laptop"] },
  { key: "screen", label: "Screen Replacement", devices: ["laptop","mobile"], requiresPart: true, defaultPart: { mobile: 120, laptop: 140 } },
  { key: "battery", label: "Battery Replacement", devices: ["laptop","mobile"], requiresPart: true, defaultPart: { mobile: 45, laptop: 80 } },
  { key: "hardware", label: "Hardware Repair", devices: ["pc","laptop","mobile"] },
  { key: "datarecovery", label: "Data Recovery", devices: ["pc","laptop","mobile"] },
  { key: "backglass", label: "Back Glass Replacement", devices: ["mobile"], requiresPart: true, defaultPart: 40 },
  { key: "malware", label: "Virus/Malware Removal", devices: ["pc","laptop"] },
  { key: "upgrade", label: "System Upgrade", devices: ["pc","laptop"] },
  { key: "swtroubleshoot", label: "Software Troubleshooting", devices: ["pc","laptop","mobile"] },
  { key: "manual", label: "Manual hours", devices: ["pc","laptop","mobile"] },
];

export const ADDONS: OptionMeta[] = [
  { key: "screenprotector", label: "Screen Protector", devices: ["mobile"], requiresPart: true, defaultPart: 15 },
  { key: "backup",          label: "Data Backup/Transfer", devices: ["pc","laptop","mobile"] },
  { key: "case",            label: "Protective Case", devices: ["mobile"], requiresPart: true, defaultPart: 20 },
  { key: "tuneup",          label: "Device Tune-up", devices: ["pc","laptop"] },
  { key: "cleaning",        label: "Device Cleaning", devices: ["pc","laptop","mobile"] },
  { key: "cooling",         label: "Cooling Service", devices: ["pc","laptop"] },
  { key: "manualAddon",     label: "Manual hours (addon)", devices: ["pc","laptop","mobile"] },
  { key: "none",            label: "No add-on", devices: ["pc","laptop","mobile"] },
];

// Helper to resolve default part number for a device
export function defaultPartFor(meta: OptionMeta, device: Device): number {
  const d = meta.defaultPart;
  if (!d) return 0;
  if (typeof d === "number") return d;
  return d[device] ?? 0;
}
