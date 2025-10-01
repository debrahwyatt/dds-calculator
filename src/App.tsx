// App.tsx
import { useEffect, useMemo, useState } from "react";
import {
  devices,
  visibleServices,
  visibleAddons,
  type DeviceKey,
  type ItemDef,
  labourFor,
  partPriceFor,
} from "./Config/config";

import TotalsCard from "./Components/TotalsCard";
import ServiceList from "./Components/ServiceList";
import DeviceSelector from "./Components/DeviceSelector";
import AddonList from "./Components/AddonList";

const teardownDiscountPerExtra: Record<DeviceKey, number> = {
  mobile: 40,
  laptop: 60,
  pc: 50,
};

export default function App() {
  const initialDevice: DeviceKey =
    (devices.find(d => (d as any).default)?.key as DeviceKey) ?? "pc";

  const [device, setDevice] = useState<DeviceKey>(initialDevice);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // NEW: manual part overrides by item key
  const [partOverrides, setPartOverrides] = useState<Record<string, number | undefined>>({});

  const filteredServices = useMemo(
    () => visibleServices.filter((s) => s.devices.includes(device)),
    [device]
  );
  const filteredAddons = useMemo(
    () => visibleAddons.filter((a) => a.devices.includes(device)),
    [device]
  );

  // prune selections & part overrides on device change (only keep visible items)
  useEffect(() => {
    const allowed = new Set([
      ...filteredServices.map((s) => s.key),
      ...filteredAddons.map((a) => a.key),
    ]);

    setSelectedServices((prev) => prev.filter((k) => allowed.has(k)));
    setSelectedAddons((prev) => prev.filter((k) => allowed.has(k)));
    setPartOverrides((prev) => {
      const next: Record<string, number | undefined> = {};
      for (const k of Object.keys(prev)) if (allowed.has(k)) next[k] = prev[k];
      return next;
    });
  }, [device, filteredServices, filteredAddons]);

  const handlePartOverride = (key: string, value?: number) =>
    setPartOverrides((prev) => ({ ...prev, [key]: value }));

  const totalsFrom = (keys: string[], pool: ItemDef[]) =>
    keys.reduce(
      (t, key) => {
        const item = pool.find((i) => i.key === key);
        if (item) {
          t.labour += labourFor(item, device);
          const override = partOverrides[key];
          const basePart = partPriceFor(item, device);
          t.parts += override ?? basePart; // override wins
        }
        return t;
      },
      { labour: 0, parts: 0 }
    );

  const svcTotals = totalsFrom(selectedServices, filteredServices);
  const addonTotals = totalsFrom(selectedAddons, filteredAddons);

  const labour = svcTotals.labour + addonTotals.labour;
  const parts = svcTotals.parts + addonTotals.parts;

  function computeTeardownDiscount(keys: string[], pool: ItemDef[], device: DeviceKey): number {
    const groups = new Map<string, number>();
    for (const key of keys) {
      const item = pool.find((i) => i.key === key);
      if (!item || !item.teardownGroup) continue;
      groups.set(item.teardownGroup, (groups.get(item.teardownGroup) ?? 0) + 1);
    }
    const perExtra = teardownDiscountPerExtra[device] ?? 0;
    let discount = 0;
    for (const [, count] of groups) if (count > 1) discount += (count - 1) * perExtra;
    return discount;
  }

  const discount =
    computeTeardownDiscount(selectedServices, filteredServices, device) +
    computeTeardownDiscount(selectedAddons, filteredAddons, device);

  return (
    <div className="app">
      <DeviceSelector value={device} onChange={setDevice} />

      <ServiceList
        items={filteredServices}
        selected={selectedServices}
        onChange={setSelectedServices}
        device={device}
        partOverrides={partOverrides}
        onPartOverride={handlePartOverride}
      />

      <AddonList
        items={filteredAddons}
        selected={selectedAddons}
        onChange={setSelectedAddons}
        device={device}
        partOverrides={partOverrides}
        onPartOverride={handlePartOverride}
      />

      <TotalsCard labour={labour} parts={parts} discount={discount} />
    </div>
  );
}
