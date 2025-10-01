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
  // NEW: teardown increment helper from your config
  incrementFor,
} from "./Config/config";

import TotalsCard from "./Components/TotalsCard";
import ServiceList from "./Components/ServiceList";
import DeviceSelector from "./Components/DeviceSelector";
import AddonList from "./Components/AddonList";

export default function App() {
  // Initial device from config default or fallback
  const initialDevice: DeviceKey =
    (devices.find(d => (d as any).default)?.key as DeviceKey) ?? "pc";

  const [device, setDevice] = useState<DeviceKey>(initialDevice);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // Manual part overrides by item key
  const [partOverrides, setPartOverrides] = useState<
    Record<string, number | undefined>
  >({});

  // Filter lists for the chosen device
  const filteredServices = useMemo(
    () => visibleServices.filter((s) => s.devices.includes(device)),
    [device]
  );
  const filteredAddons = useMemo(
    () => visibleAddons.filter((a) => a.devices.includes(device)),
    [device]
  );

  // Combined pool (lets us compute teardown groups across both lists if needed)
  const combinedPool = useMemo<ItemDef[]>(
    () => [...filteredServices, ...filteredAddons],
    [filteredServices, filteredAddons]
  );

  // Prune selections & part overrides on device change (only keep visible items)
  useEffect(() => {
    const allowed = new Set(combinedPool.map((i) => i.key));

    setSelectedServices((prev) => prev.filter((k) => allowed.has(k)));
    setSelectedAddons((prev) => prev.filter((k) => allowed.has(k)));

    setPartOverrides((prev) => {
      const next: Record<string, number | undefined> = {};
      for (const k of Object.keys(prev)) if (allowed.has(k)) next[k] = prev[k];
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device, combinedPool]);

  const handlePartOverride = (key: string, value?: number) =>
    setPartOverrides((prev) => ({ ...prev, [key]: value }));

  /* ------------------- Labour & Parts Computations ------------------- */

  // 1) Naive labour: just sum base labour for selected items
  function sumBaseLabour(keys: string[], pool: ItemDef[], dev: DeviceKey): number {
    return keys.reduce((sum, key) => {
      const item = pool.find((i) => i.key === key);
      return item ? sum + labourFor(item, dev) : sum;
    }, 0);
  }

  // 2) Grouped labour with teardown sharing:
  // For each teardownGroup, charge max(base labour) + increments for the remaining items.
  // Implementation detail: we sum all increments and subtract the largest one
  // so the "primary" job contributes its base labour instead of its increment.
  function computeGroupedLabour(keys: string[], pool: ItemDef[], dev: DeviceKey): number {
    // Group selected items by teardownGroup; ungrouped items get their own solo group
    const byGroup = new Map<string, ItemDef[]>();

    for (const k of keys) {
      const item = pool.find((i) => i.key === k);
      if (!item) continue;
      const groupKey = item.teardownGroup ?? `__solo__${k}`;
      const arr = byGroup.get(groupKey) ?? [];
      arr.push(item);
      byGroup.set(groupKey, arr);
    }

    let total = 0;

    for (const [, items] of byGroup) {
      if (items.length === 1 && !items[0].teardownGroup) {
        // Ungrouped single item: just its labour
        total += labourFor(items[0], dev);
        continue;
      }

      // Grouped items:
      // Primary job: the one with the highest base labour
      let maxLabour = 0;
      let sumIncrements = 0;
      let largestIncrement = 0;

      for (const it of items) {
        const base = labourFor(it, dev);
        const inc = incrementFor(it, dev);
        if (base > maxLabour) maxLabour = base;
        sumIncrements += inc;
        if (inc > largestIncrement) largestIncrement = inc;
      }

      // Charge base of the primary + increments for the rest
      total += maxLabour + (sumIncrements - largestIncrement);
    }

    return total;
  }

  // 3) Parts with manual overrides (override wins)
  function computeParts(
    keys: string[],
    pool: ItemDef[],
    dev: DeviceKey,
    overrides: Record<string, number | undefined>
  ): number {
    return keys.reduce((sum, key) => {
      const item = pool.find((i) => i.key === key);
      if (!item) return sum;
      const override = overrides[key];
      const base = partPriceFor(item, dev);
      return sum + (override ?? base);
    }, 0);
  }

  // Selections (combined for labour discount and parts)
  const allSelectedKeys = useMemo(
    () => [...selectedServices, ...selectedAddons],
    [selectedServices, selectedAddons]
  );

  // Labour: naive vs grouped (to compute bundle savings)
  const naiveLabour =
    sumBaseLabour(allSelectedKeys, combinedPool, device);

  const groupedLabour =
    computeGroupedLabour(allSelectedKeys, combinedPool, device);

  // Bundle savings shown as a "Discount" line
  const discount = Math.max(0, naiveLabour - groupedLabour);

  // Use grouped labour as the actual labour billed
  const labour = groupedLabour;

  // Parts
  const parts =
    computeParts(selectedServices, filteredServices, device, partOverrides) +
    computeParts(selectedAddons, filteredAddons, device, partOverrides);

  /* ----------------------------- Render ------------------------------ */

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
