import { useMemo, useState } from "react";
import type { Device } from "../engine/hours";
import { SERVICES, ADDONS, defaultPartFor } from "../config/services";
import type { ServiceKey, AddonKey, OptionMeta } from "../config/services";
import { computeTotals, etaRangeFromToday, money } from "../engine/pricing";

export function useCalculator() {
  const [device, setDevice] = useState<Device>("mobile");
  const [platform, setPlatform] = useState<"apple" | "other">("other");
  const [serviceKey, setServiceKey] = useState<ServiceKey>("diagnostic");
  const [addonKey, setAddonKey] = useState<AddonKey>("none");
  const [manualHours, setManualHours] = useState(0);
  const [partInputs, setPartInputs] = useState<Record<string, number | undefined>>({});

  function visibleOptions(list: OptionMeta[]) {
    return list.filter(o => o.devices.includes(device));
  }

  function partForOption(meta: OptionMeta): number {
    const typed = partInputs[meta.key];
    if (typed != null && typed >= 0) return typed;
    return defaultPartFor(meta, device);
  }

  const selectedServiceMeta = useMemo(() => SERVICES.find(s => s.key === serviceKey), [serviceKey]);
  const selectedAddonMeta   = useMemo(() => ADDONS.find(a => a.key === addonKey), [addonKey]);

  const servicePart = selectedServiceMeta?.requiresPart ? partForOption(selectedServiceMeta) : 0;
  const addonPart   = selectedAddonMeta?.requiresPart ? partForOption(selectedAddonMeta) : 0;

  const totals = computeTotals({ device, serviceKey, manualHours, servicePart, addonPart });

  const eta = useMemo(() => {
    const { start, end } = etaRangeFromToday();
    return `${start.toLocaleDateString(undefined, { weekday:'short', month:'short', day:'numeric' })} – ${end.toLocaleDateString(undefined, { weekday:'short', month:'short', day:'numeric' })}`;
  }, [device, serviceKey, manualHours, servicePart, addonPart]);

  function setPart(key: string, value?: number) {
    setPartInputs(prev => ({ ...prev, [key]: value }));
  }

  function copySummary() {
    const lines = [
      `Device: ${device}`,
      `Platform: ${platform === "other" ? "Windows/Android" : "Apple"}`,
      `Service type: ${serviceKey}`,
      `Parts: ${money(totals.parts)}`,
      `Shipping: ${money(totals.shipping)}`,
      `Subtotal: ${money(totals.subtotal)}`,
      `GST (5%): ${money(totals.gst)}`,
      `Grand total (estimate): ${money(totals.grand)}`,
      `ETA: ${eta} (parts 7–10 days + 2 days service)`,
      `Labor: ${totals.hours.toFixed(2)} hour(s) × $80/hr = ${money(totals.labor)}`
    ].join('\n');
    navigator.clipboard.writeText(lines);
  }

  return {
    // state
    device, setDevice,
    platform, setPlatform,
    serviceKey, setServiceKey,
    addonKey, setAddonKey,
    manualHours, setManualHours,
    partInputs, setPart,

    // computed
    visibleServices: visibleOptions(SERVICES),
    visibleAddons: visibleOptions(ADDONS),
    selectedServiceMeta,
    selectedAddonMeta,
    servicePart,
    addonPart,
    totals,
    eta,
    copySummary,
  };
}
