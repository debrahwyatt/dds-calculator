// Components/ServiceList.tsx
import Service from "./Service";
import type { ItemDef, DeviceKey } from "../Config/config";

export default function ServiceList({
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
      <h2>Service Type</h2>
      <div className="radio-row">
        {items.map((svc) => (
          <Service
            key={svc.key}
            service={svc}
            checked={selected.includes(svc.key)}
            onToggle={toggle}
            device={device}
            partValue={partOverrides[svc.key]}
            onPartChange={onPartOverride}
          />
        ))}
      </div>
    </div>
  );
}
