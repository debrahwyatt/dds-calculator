import { useState } from "react";
import type { ItemDef, DeviceKey } from "../Config/config";
import AddonDetails from "./AddonDetails";

export default function Addon({
  addon,
  checked,
  onToggle,
  device,
  partValue,
  onPartChange,
}: {
  addon: ItemDef;
  checked: boolean;
  onToggle: (key: string) => void;
  device: DeviceKey;
  partValue?: number;
  onPartChange?: (key: string, value?: number) => void;
}) {
  const { key, label } = addon;

  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(v => !v);

  return (
    <div className={`service option ${expanded ? "expanded" : ""}`}>
      <label className="radio option-label" onClick={toggleExpanded}>
        <input
          type="checkbox"
          name={`addon_${key}`}
          value={key}
          checked={checked}
          onChange={(e) => {
            e.stopPropagation();
            const nextChecked = !checked;
            onToggle(key);
            if (nextChecked) setExpanded(true);   // auto-open when checking
            if (!nextChecked) setExpanded(false); // close when unchecking
          }}
          onClick={(e) => e.stopPropagation()}
        />
        <span className="text">{label}</span>
      </label>

      {/* Only render details when selected AND expanded */}
      {checked && expanded && (
        <AddonDetails
          addon={addon}
          device={device}
          partValue={Number.isFinite(partValue ?? NaN) ? (partValue as number) : undefined}
          onPartChange={onPartChange}
        />
      )}
    </div>
  );
}
