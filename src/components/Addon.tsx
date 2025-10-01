// Components/Addon.tsx
import type { ItemDef, DeviceKey } from "../Config/config";
import { labourFor, partPriceFor } from "../Config/config";

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
  const { key, label, requiresPart } = addon;
  const labour = labourFor(addon, device);
  const defaultPart = partPriceFor(addon, device);
  const effectivePart = partValue ?? defaultPart;

  const handlePartInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.currentTarget.value.trim();
    if (!onPartChange) return;
    if (v === "") {
      onPartChange(key, undefined);
      return;
    }
    const num = Number(v);
    onPartChange(key, Number.isFinite(num) ? num : undefined);
  };

  return (
    <label className="radio option">
      <input
        type="checkbox"
        name={`addon_${key}`}
        value={key}
        checked={checked}
        onChange={() => onToggle(key)}
      />
      <span className="option-label">
        {label} – Labour: ${labour}
      </span>

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
