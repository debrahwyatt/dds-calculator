// Components/AddonList.tsx
import Addon from "./Addon";
import type { ItemDef, DeviceKey } from "../Config/config";

export default function AddonList({
  items,
  selected,
  onChange,
  device,
  partOverrides,
  onPartOverride,
}: {
  items: ItemDef[];
  selected: string[];
  onChange: (keys: string[]) => void;
  device: DeviceKey;
  partOverrides: Record<string, number | undefined>;
  onPartOverride: (key: string, value?: number) => void;
}) {
  const toggle = (key: string) =>
    onChange(selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key]);

  return (
    <div className="section">
      <h2>Add-ons</h2>
      <div className="radio-row">
        {items.map((a) => (
          <Addon
            key={a.key}
            addon={a}
            checked={selected.includes(a.key)}
            onToggle={toggle}
            device={device}
            partValue={partOverrides[a.key]}
            onPartChange={onPartOverride}
          />
        ))}
      </div>
    </div>
  );
}
