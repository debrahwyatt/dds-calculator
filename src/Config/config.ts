// Config/config.ts
export type DeviceKey = "pc" | "laptop" | "mobile";

export type DeviceDef = {
  key: DeviceKey;
  label: string;
  default?: boolean;
};

export type ItemDef = {
  key: string;
  label: string;
  labour: number | Partial<Record<DeviceKey, number>>;
  partdefault?: number | Partial<Record<DeviceKey, number>>;
  devices: DeviceKey[];
  teardownGroup?: string;
  requiresPart?: boolean; 
  teardownIncrementLabour?: number | Partial<Record<DeviceKey, number>>;
};

export const devices = [
  { key: "pc",     label: "PC / Desktop", default: true },
  { key: "laptop", label: "Laptop" },
  { key: "mobile", label: "Mobile" },
] as const satisfies readonly DeviceDef[];

export function partPriceFor(item: ItemDef, device: DeviceKey): number {
  const p = item.partdefault;
  if (p == null) return 0;
  return typeof p === "number" ? p : (p[device] ?? 0);
}
export function labourFor(item: ItemDef, device: DeviceKey): number {
  const l = item.labour;
  return typeof l === "number" ? l : (l[device] ?? 0);
}
export function incrementFor(item: ItemDef, device: DeviceKey): number {
  const inc = item.teardownIncrementLabour;
  if (inc == null) return 0;
  return typeof inc === "number" ? inc : (inc[device] ?? 0);
}

/* -------- Services & Add-ons -------- */

export const visibleServices: ItemDef[] = [
  {
    key: "diagnostic", label: "Diagnostic Assessment",
    devices: ["pc", "laptop", "mobile"],
    labour: { pc: 60, laptop: 60, mobile: 60 },
  },
  {
    key: "osreinstall", label: "OS Recovery/Reinstall",
    devices: ["pc", "laptop"],
    labour: { pc: 100, laptop: 100 },
  },
  {
    key: "screen", label: "Screen Replacement",
    devices: ["laptop", "mobile"],
    labour: { laptop: 150, mobile: 120 },
    partdefault: { laptop: 160, mobile: 75 },
    teardownGroup: "front-open",
    requiresPart: true, 
    teardownIncrementLabour: { laptop: 75, mobile: 60 },
  },
  {
    key: "battery", label: "Battery Replacement",
    devices: ["laptop", "mobile"],
    labour: { laptop: 100, mobile: 140 },
    partdefault: { laptop: 80, mobile: 45 },
    teardownGroup: "front-open",
    requiresPart: true, 
    teardownIncrementLabour: { laptop: 50, mobile: 70 },
  },
  {
    key: "hardware", label: "Hardware Repair",
    devices: ["pc", "laptop", "mobile"],
    labour: { pc: 90, laptop: 110, mobile: 140 },
    teardownGroup: "front-open",
    teardownIncrementLabour: { pc: 45, laptop: 55, mobile: 70 },

  },
  {
    key: "datarecovery", label: "Data Recovery",
    devices: ["pc", "laptop", "mobile"],
    labour: { pc: 150, laptop: 160, mobile: 120 },
  },
  {
    key: "backglass", label: "Back Glass Replacement",
    devices: ["mobile"],
    labour: { mobile: 100 },
    partdefault: { mobile: 15 },
    teardownGroup: "back-open",
    requiresPart: true, 
    teardownIncrementLabour: { mobile: 50 },
  },
  {
    key: "malware", label: "Virus/Malware Removal",
    devices: ["pc", "laptop"],
    labour: { pc: 90, laptop: 90 },
  },
  {
    key: "upgrade", label: "System Upgrade",
    devices: ["pc", "laptop"],
    labour: { pc: 80, laptop: 80 },
    teardownGroup: "front-open",
    teardownIncrementLabour: { pc: 40, laptop: 40 },    
  },
  {
    key: "swtroubleshoot", label: "Software Troubleshooting",
    devices: ["pc", "laptop", "mobile"],
    labour: { pc: 80, laptop: 80, mobile: 80 },
  },
];

export const visibleAddons: ItemDef[] = [
  {
    key: "screenprotector", label: "Screen Protector",
    devices: ["mobile"],
    labour: { mobile: 10 },
    partdefault: { mobile: 10 },
    requiresPart: true, 
  },
  {
    key: "backup", label: "Data Backup/Transfer",
    devices: ["pc", "laptop", "mobile"],
    labour: { pc: 40, laptop: 40, mobile: 40 },
  },
  {
    key: "case", label: "Protective Case",
    devices: ["mobile"],
    labour: { mobile: 0 },
    partdefault: { mobile: 25 },
    requiresPart: true, 
  },
  {
    key: "tuneup", label: "Device Tune-up",
    devices: ["pc", "laptop", "mobile"],
    labour: { pc: 60, laptop: 60, mobile: 60 },
  },
  {
    key: "cleaning", label: "Device Cleaning",
    devices: ["pc", "laptop", "mobile"],
    labour: { pc: 40, laptop: 60, mobile: 40 },
  },
  {
    key: "cooling", label: "Cooling Service",
    devices: ["pc", "laptop"],
    labour: { pc: 40, laptop: 60 },
  },
];
