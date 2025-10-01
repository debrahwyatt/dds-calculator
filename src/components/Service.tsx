// Components/Service.tsx
import type { ItemDef, DeviceKey } from "../Config/config";
import { labourFor, partPriceFor } from "../Config/config";

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
  partValue?: number; // override (if set)
  onPartChange?: (key: string, value?: number) => void;
}) {
  const { key, label, requiresPart } = service;
  const labour = labourFor(service, device);

  // default per-device part
  const defaultPart = partPriceFor(service, device);
  // the value shown/used: override if present, otherwise default
  const effectivePart = partValue ?? defaultPart;

  const handlePartInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value.trim();
    if (!onPartChange) return;
    if (v === "") {
      onPartChange(key, undefined); // clears override → falls back to default
      return;
    }
    const num = Number(v);
    onPartChange(key, Number.isFinite(num) ? num : undefined);
  };

  return (
    <label className="radio option">
      <input
        type="checkbox"
        name={`service_${key}`}
        value={key}
        checked={checked}
        onChange={() => onToggle(key)}
      />
      <span className="option-label">
        {label} – Labour: ${labour}
      </span>

      {/* Manual part override (only when selected & requires part) */}
      {checked && requiresPart && (
        <input
          className="part-input no-spin"
          type="number"
          inputMode="decimal"
          step="0.01"
          placeholder={defaultPart > 0 ? defaultPart.toString() : "0.00"}
          value={Number.isFinite(effectivePart) ? String(effectivePart) : ""}
          onChange={handlePartInput}
          aria-label={`${label} part price`}
        />
      )}
    </label>
  );
}
