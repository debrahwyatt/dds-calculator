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
  discountGroup?: string;
  requiresPart?: boolean; 
  labour: number | Partial<Record<DeviceKey, number>>;
  partdefault?: number | Partial<Record<DeviceKey, number>>;  
  discountPrice?: number | Partial<Record<DeviceKey, number>>;  
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
  const inc = item.discountPrice;
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
    eta: "45 min",    
  },
  {
    key: "osreinstall", label: "OS Recovery/Reinstall",
    devices: ["pc", "laptop"],
    labour: { pc: 100, laptop: 100 },
    desc: "Backup data, wipe/repair drive, reinstall OS, drivers, and core updates, put user data back.",
    eta: "SSD: 2-3 hours, HDD: 1-2 days",    
  },
  {
    key: "screen", label: "Screen Replacement",
    devices: ["laptop", "mobile"],
    labour: { laptop: 150, mobile: 120 },
    partdefault: { laptop: 160, mobile: 75 },
    discountGroup: "open",
    requiresPart: true, 
    discountPrice: { laptop: 75, mobile: 60 },
    desc: "Replace cracked or unresponsive display assembly and test touch, brightness, and cameras.",
    eta: "Laptop: 3 hours, Mobile: 24 hours",
  },
  {
    key: "battery", label: "Battery Replacement",
    devices: ["laptop", "mobile"],
    labour: { laptop: 100, mobile: 140 },
    partdefault: { laptop: 80, mobile: 45 },
    discountGroup: "open",
    requiresPart: true, 
    discountPrice: { laptop: 50, mobile: 70 },
    desc: "Remove old battery, install new unit, and verify charge/health.",
    eta: "Laptop: 1-2 hour, Mobile: 24 hours",    
  },
  {
    key: "hardware", label: "Hardware Repair",
    devices: ["pc", "laptop", "mobile"],
    labour: { pc: 90, laptop: 110, mobile: 140 },
    discountGroup: "open",
    discountPrice: { pc: 45, laptop: 55, mobile: 70 },
    desc: "Diagnose/replace failing components (keyboards, fans, ports, storage, etc.).",
    eta: "2-4 hours (varies by part)",
  },
  {
    key: "datarecovery", label: "Data Recovery",
    devices: ["pc", "laptop", "mobile"],
    labour: { pc: 150, laptop: 160, mobile: 120 },
    desc: "Attempt to recover files from failing drives/phones. No charge for unsuccessful attempts.",
    eta: "1-3 days (case-dependent)",    
  },
  {
    key: "backglass", label: "Back Glass Replacement",
    devices: ["mobile"],
    labour: { mobile: 100 },
    partdefault: { mobile: 15 },
    discountGroup: "open",
    requiresPart: true, 
    discountPrice: { mobile: 50 },
    desc: "Replace shattered rear glass and verify cameras/wireless charging function.",
    eta: "24 hours",    
  },
  {
    key: "malware", label: "Virus/Malware Removal",
    devices: ["pc", "laptop"],
    labour: { pc: 90, laptop: 90 },
    desc: "Deep scans, cleanup, browser reset, core updates, and tool removal",
    eta: "SSD: 2-3 hours, HDD 1-2 days",    
  },
  {
    key: "ssdupgrade", label: "SSD Upgrade",
    devices: ["pc", "laptop"],
    labour: { pc: 100, laptop: 100 },
    requiresPart: true, 
    partdefault: { pc: 80, laptop: 70 },
    discountGroup: "open",
    discountPrice: { pc: 0, laptop: 40 },    
    desc: "Clone data to SSD, install new drive, test compatability, and update drivers.",
    eta: "24 hours",    
  },  
  {
    key: "upgrade", label: "System Upgrade",
    devices: ["pc", "laptop"],
    labour: { pc: 80, laptop: 120 },
    discountGroup: "open",
    discountPrice: { pc: 0, laptop: 40 },    
    desc: "Install component (RAM, GPU, CPU, network card, etc.) and optimize settings for better performance.",
    eta: "1-2 hours",
  },
  {
    key: "swtroubleshoot", label: "Software Troubleshooting",
    devices: ["pc", "laptop", "mobile"],
    labour: { pc: 80, laptop: 80, mobile: 80 },
    desc: "Fix crashes, configuration issues, and app errors; apply updates and tuning.",
    eta: "1-2 hours",
  }
];

export const visibleAddons: ItemDef[] = [
  {
    key: "screenprotector",
    label: "Screen Protector",
    devices: ["mobile"],
    labour: { mobile: 10 },
    partdefault: { mobile: 10 },
    requiresPart: true,
    discountGroup: "cleaning",
    discountPrice: { mobile: 5 },    
    desc: "Install a tempered glass or film protector to guard against scratches and cracks. Includes device cleaning.",
    eta: "15-30 min",
  },
  {
    key: "backup",
    label: "Data Backup/Transfer",
    devices: ["pc", "laptop", "mobile"],
    labour: { pc: 40, laptop: 40, mobile: 40 },
    desc: "Transfer user files (photos, documents, downloads, etc.) to a new device or backup drive.",
    eta: "SSD: 1-2 hours, HDD: 24 hours (depends on data size)",
  },
  {
    key: "case",
    label: "Protective Case",
    devices: ["mobile"],
    labour: { mobile: 10 },
    partdefault: { mobile: 25 },
    requiresPart: true,
    discountGroup: "cleaning",
    discountPrice: { mobile: 5 },    
    desc: "Provide and fit a durable case to protect your phone from drops and daily wear, includes device cleaning.",
    eta: "10-15 min",
  },
  {
    key: "tuneup",
    label: "Device Tune-up",
    devices: ["pc", "laptop", "mobile"],
    labour: { pc: 60, laptop: 60, mobile: 60 },
    desc: "Clean temporary files, optimize startup, update apps/OS, and improve performance.",
    eta: "1-2 hours",
  },
  {
    key: "cleaning",
    label: "Device Cleaning",
    devices: ["pc", "laptop", "mobile"],
    labour: { pc: 40, laptop: 60, mobile: 20 },
    discountGroup: "cleaning",
    discountPrice: { mobile: 10 },    
    desc: "Physical cleaning of fans, vents, and screens to reduce heat and extend lifespan.",
    eta: "30-60 min",
  },
  {
    key: "cooling",
    label: "Cooling Service",
    devices: ["pc", "laptop"],
    labour: { pc: 40, laptop: 60 },
    desc: "Replace thermal paste, clean dust, and improve airflow to keep your system cooler.",
    eta: "30-60 minutes",
    discountGroup: "open",
    requiresPart: true, 
    discountPrice: { pc: 30, laptop: 40 },    
  },
];
