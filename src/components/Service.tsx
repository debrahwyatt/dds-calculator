// Components/Service.tsx
import { useState } from "react";
import type { ItemDef, DeviceKey } from "../Config/config";
import { labourFor, partPriceFor } from "../Config/config";
import ServiceDetails from "./ServiceDetails";

export default function Service({
  service,
  checked,
  onToggle,
  device,
  partValue,
  onPartChange,
}: {
  service: ItemDef;
  checked: boolean;
  onToggle: (key: string) => void;
  device: DeviceKey;
  partValue?: number;
  onPartChange?: (key: string, value?: number) => void;
}) {
  const { key, label } = service;
  const labour = labourFor(service, device);

  const defaultPart = partPriceFor(service, device);
  const effectivePart = partValue ?? defaultPart;

  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(v => !v);

  return (
    <div className={`service option ${expanded ? "expanded" : ""}`}>
      <label className="radio option-label" onClick={toggleExpanded}>
        <input
          type="checkbox"
          name={`service_${key}`}
          value={key}
          checked={checked}
          onChange={(e) => {
            e.stopPropagation();
            // flip checked
            const nextChecked = !checked;
            onToggle(key);

            // If turning ON, optionally auto-expand
            if (nextChecked) setExpanded(true);

            // If turning OFF, force-collapse details so they disappear
            if (!nextChecked) setExpanded(false);
          }}
          onClick={(e) => e.stopPropagation()}
        />
        <span className="text">{label}</span>
      </label>

      {/* Only render details when selected AND expanded */}
      {checked && expanded && (
        <ServiceDetails
          service={service}
          device={device}
          partValue={Number.isFinite(effectivePart) ? effectivePart : undefined}
          onPartChange={onPartChange}
        />
      )}
    </div>
  );
}
