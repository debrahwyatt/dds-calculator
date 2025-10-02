// Config/config.ts
export type DeviceKey = "pc" | "laptop" | "mobile";

export type DeviceDef = {
  key: DeviceKey;
  label: string;
  default?: boolean;
};

export type ItemDef = {
  key: string;
  eta?: string;  
  desc?: string;  
  label: string;
  devices: DeviceKey[];
  teardownGroup?: string;
  requiresPart?: boolean; 
  labour: number | Partial<Record<DeviceKey, number>>;
  partdefault?: number | Partial<Record<DeviceKey, number>>;  
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
    desc: "Full device inspection to identify hardware/software issues and provide a repair plan.",
    eta: "30–60 min",    
  },
  {
    key: "osreinstall", label: "OS Recovery/Reinstall",
    devices: ["pc", "laptop"],
    labour: { pc: 100, laptop: 100 },
    desc: "Backup (if requested), wipe/repair, reinstall OS, drivers, and core updates.",
    eta: "2–3 hours",    
  },
  {
    key: "screen", label: "Screen Replacement",
    devices: ["laptop", "mobile"],
    labour: { laptop: 150, mobile: 120 },
    partdefault: { laptop: 160, mobile: 75 },
    teardownGroup: "front-open",
    requiresPart: true, 
    teardownIncrementLabour: { laptop: 75, mobile: 60 },
    desc: "Replace cracked or unresponsive display assembly and test touch, brightness, and cameras.",
    eta: "1.5–3 hours (after parts arrive)",    
  },
  {
    key: "battery", label: "Battery Replacement",
    devices: ["laptop", "mobile"],
    labour: { laptop: 100, mobile: 140 },
    partdefault: { laptop: 80, mobile: 45 },
    teardownGroup: "front-open",
    requiresPart: true, 
    teardownIncrementLabour: { laptop: 50, mobile: 70 },
    desc: "Remove old battery, install new OEM/grade-A unit, and verify charge/health.",
    eta: "1–2 hours (after parts arrive)",    
  },
  {
    key: "hardware", label: "Hardware Repair",
    devices: ["pc", "laptop", "mobile"],
    labour: { pc: 90, laptop: 110, mobile: 140 },
    teardownGroup: "front-open",
    teardownIncrementLabour: { pc: 45, laptop: 55, mobile: 70 },
    desc: "Diagnose/replace failing components (keyboards, fans, ports, storage, etc.).",
    eta: "2–4 hours (varies by part availability)",
  },
  {
    key: "datarecovery", label: "Data Recovery",
    devices: ["pc", "laptop", "mobile"],
    labour: { pc: 150, laptop: 160, mobile: 120 },
    desc: "Attempt to recover files from failing drives/phones. No data, no labour charge on basic attempts.",
    eta: "Same day to 3 days (case-dependent)",    
  },
  {
    key: "backglass", label: "Back Glass Replacement",
    devices: ["mobile"],
    labour: { mobile: 100 },
    partdefault: { mobile: 15 },
    teardownGroup: "back-open",
    requiresPart: true, 
    teardownIncrementLabour: { mobile: 50 },
    desc: "Replace shattered rear glass and verify cameras/wireless charging function.",
    eta: "1–2 hours (after parts arrive)",    
  },
  {
    key: "malware", label: "Virus/Malware Removal",
    devices: ["pc", "laptop"],
    labour: { pc: 90, laptop: 90 },
    desc: "Deep scans, cleanup, browser reset, and core updates. Optional AV installation.",
    eta: "1.5–3 hours",    
  },
  {
    key: "upgrade", label: "System Upgrade",
    devices: ["pc", "laptop"],
    labour: { pc: 80, laptop: 80 },
    teardownGroup: "front-open",
    teardownIncrementLabour: { pc: 40, laptop: 40 },    
    desc: "Install RAM/SSD/other components and optimize settings for better performance.",
    eta: "1–2 hours",    
  },
  {
    key: "swtroubleshoot", label: "Software Troubleshooting",
    devices: ["pc", "laptop", "mobile"],
    labour: { pc: 80, laptop: 80, mobile: 80 },
    desc: "Fix crashes, configuration issues, and app errors; apply updates and tuning.",
    eta: "1–2 hours",    
  },
];

export const visibleAddons: ItemDef[] = [
  {
    key: "screenprotector",
    label: "Screen Protector",
    devices: ["mobile"],
    labour: { mobile: 10 },
    partdefault: { mobile: 10 },
    requiresPart: true,
    desc: "Install a tempered glass or film protector to guard against scratches and cracks.",
    eta: "15–30 min",
  },
  {
    key: "backup",
    label: "Data Backup/Transfer",
    devices: ["pc", "laptop", "mobile"],
    labour: { pc: 40, laptop: 40, mobile: 40 },
    desc: "Transfer files, photos, and documents to a new device or backup drive.",
    eta: "30–90 min (depends on data size)",
  },
  {
    key: "case",
    label: "Protective Case",
    devices: ["mobile"],
    labour: { mobile: 0 },
    partdefault: { mobile: 25 },
    requiresPart: true,
    desc: "Provide and fit a durable case to protect your phone from drops and daily wear.",
    eta: "10–15 min",
  },
  {
    key: "tuneup",
    label: "Device Tune-up",
    devices: ["pc", "laptop", "mobile"],
    labour: { pc: 60, laptop: 60, mobile: 60 },
    desc: "Clean temporary files, optimize startup, update apps/OS, and improve performance.",
    eta: "1–2 hours",
  },
  {
    key: "cleaning",
    label: "Device Cleaning",
    devices: ["pc", "laptop", "mobile"],
    labour: { pc: 40, laptop: 60, mobile: 40 },
    desc: "Physical cleaning of fans, vents, and screens to reduce heat and extend lifespan.",
    eta: "30–60 min",
  },
  {
    key: "cooling",
    label: "Cooling Service",
    devices: ["pc", "laptop"],
    labour: { pc: 40, laptop: 60 },
    desc: "Replace thermal paste, clean dust, and improve airflow to keep your system cooler.",
    eta: "1–2 hours",
  },
];
