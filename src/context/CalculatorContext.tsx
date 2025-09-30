import type { Device } from "../engine/prices";
import { DEFAULT_PRICES } from "../engine/prices";
import { SERVICES, ADDONS, defaultPartFor } from "../config/services";
import type { ServiceKey, AddonKey, OptionMeta } from "../config/services";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { etaRangeFromToday, money, computeTotalsFromPartsAndLabour } from "../engine/pricing";

type Ctx = {
  // state
  device: Device; setDevice: (d: Device) => void;
  serviceKeys: ServiceKey[]; toggleService: (k: ServiceKey) => void; clearServices: () => void;
  addonKeys: AddonKey[]; toggleAddon: (k: AddonKey) => void; clearAddons: () => void;
  manualHours: number; setManualHours: (n: number) => void;
  partInputs: Record<string, number | undefined>; setPart: (key: string, val?: number) => void;

  // derived lists (filtered by device)
  visibleServices: OptionMeta[];
  visibleAddons: OptionMeta[];

  // selected metas
  selectedServiceMetas: OptionMeta[];
  selectedAddonMetas: OptionMeta[];

  // totals + helpers
  totals: ReturnType<typeof computeTotalsFromPartsAndLabour>;
  eta: string;
  priceForKey: (key: string) => number;
  copySummary: () => Promise<void>;
};

const CalculatorContext = createContext<Ctx | null>(null);

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  // ===== Shared state =====
  const [device, setDevice] = useState<Device>("pc"); // default PC
  const [serviceKeys, setServiceKeys] = useState<ServiceKey[]>(["diagnostic"]);
  const [addonKeys, setAddonKeys] = useState<AddonKey[]>([]);
  const [manualHours, setManualHours] = useState(0);
  const [partInputs, setPartInputs] = useState<Record<string, number | undefined>>({});

  // ===== Filter lists by device =====
  const visibleServices = useMemo(() => SERVICES.filter(s => s.devices.includes(device)), [device]);
  const visibleAddons   = useMemo(() => ADDONS.filter(a => a.devices.includes(device)), [device]);

  // ===== Keep selections valid on device change =====
  useEffect(() => {
    setServiceKeys(prev => prev.filter(k => visibleServices.some(s => s.key === k)));
    setAddonKeys(prev => prev.filter(k => visibleAddons.some(a => a.key === k)));
  }, [device, visibleServices, visibleAddons]);

  // ===== Toggle helpers =====
  function toggleService(k: ServiceKey) {
    setServiceKeys(prev => (prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]));
  }
  function clearServices() { setServiceKeys([]); }

  function toggleAddon(k: AddonKey) {
    setAddonKeys(prev => (prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]));
  }
  function clearAddons() { setAddonKeys([]); }

  function setPart(key: string, value?: number) {
    setPartInputs(prev => ({ ...prev, [key]: value }));
  }

  // ===== Selected metas =====
  const selectedServiceMetas = useMemo(
    () => visibleServices.filter(s => serviceKeys.includes(s.key as ServiceKey)),
    [visibleServices, serviceKeys]
  );
  const selectedAddonMetas = useMemo(
    () => visibleAddons.filter(a => addonKeys.includes(a.key as AddonKey)),
    [visibleAddons, addonKeys]
  );

  // ===== Hours sum (services only) =====
  const priceForKey = (key: string) => {
    if (key === "manual") return Math.max(0, manualHours || 0);
    return DEFAULT_PRICES[device]?.[key] ?? 0;
  };

  const totalPrice = useMemo(() => {
    // Deduplicate in case (shouldn't happen via UI, but safe)
    const set = new Set(serviceKeys);
    let sum = 0;
    set.forEach(k => { sum += priceForKey(k); });
    return sum;
  }, [serviceKeys, device, manualHours]);

  // ===== Parts sum (services + addons) =====
  const resolvePart = (meta: OptionMeta) => {
    if (!meta.requiresPart) return 0;
    const typed = partInputs[meta.key];
    if (typed != null && typed >= 0) return typed;
    return defaultPartFor(meta, device);
  };

  const totalParts = useMemo(() => {
    const svcParts = selectedServiceMetas.reduce((acc, m) => acc + resolvePart(m), 0);
    const addParts = selectedAddonMetas.reduce((acc, m) => acc + resolvePart(m), 0);
    return svcParts + addParts;
  }, [selectedServiceMetas, selectedAddonMetas, partInputs, device]);

  // ===== Totals & ETA =====
  const totals = useMemo(
    () => computeTotalsFromPartsAndLabour({ price: totalPrice, parts: totalParts }),
    [totalPrice, totalParts]
  );

  const eta = useMemo(() => {
    const { start, end } = etaRangeFromToday();
    const fmt = (d: Date) => d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    return `${fmt(start)} – ${fmt(end)}`;
  }, [totalPrice, totalParts, device]);

  async function copySummary() {
    const lines = [
      `Device: ${device}`,
      `Services: ${serviceKeys.join(", ") || "—"}`,
      `Add-ons: ${addonKeys.join(", ") || "—"}`,
      `Parts: ${money(totals.parts)}`,
      `Shipping: ${money(totals.shipping)}`,
      `Subtotal: ${money(totals.subtotal)}`,
      `GST (5%): ${money(totals.gst)}`,
      `Grand total (estimate): ${money(totals.grand)}`,
      `ETA: ${eta} (parts 7–10 days + 2 days service)`,
      `Labour: ${money(totals.labor)}`
    ].join("\n");
    await navigator.clipboard.writeText(lines);
  }

  const value: Ctx = {
    // state
    device, setDevice,
    serviceKeys, toggleService, clearServices,
    addonKeys, toggleAddon, clearAddons,
    manualHours, setManualHours,
    partInputs, setPart,

    // derived
    visibleServices, visibleAddons,
    selectedServiceMetas, selectedAddonMetas,

    // totals
    totals, eta,
    priceForKey,
    copySummary,
  };

  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>;
}

export function useCalculator(): Ctx {
  const ctx = useContext(CalculatorContext);
  if (!ctx) throw new Error("useCalculator must be used within <CalculatorProvider>");
  return ctx;
}
