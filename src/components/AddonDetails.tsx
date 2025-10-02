// Components/AddonDetails.tsx
import { useMemo } from "react";
import type { ItemDef, DeviceKey } from "../Config/config";
import { labourFor, partPriceFor } from "../Config/config";

const GST = 0.05;

export default function AddonDetails({
  addon,
  device,
  partValue,
  onPartChange,
}: {
  addon: ItemDef;          // from visibleAddons
  device: DeviceKey;
  partValue?: number;      // override (if set)
  onPartChange?: (key: string, value?: number) => void;
}) {
  const { key, label, requiresPart, desc, eta } = addon;

  // Lookups from config (per device)
  const labour = labourFor(addon, device);
  const defaultPart = partPriceFor(addon, device);

  // Show parts UI only if there's a default OR a user override value
  const hasPartOverride = Number.isFinite(partValue ?? NaN);
  const showParts = !!requiresPart && (hasPartOverride || (defaultPart ?? 0) > 0);

  const effectivePart = hasPartOverride ? (partValue as number) : (defaultPart ?? 0);

  const math = useMemo(() => {
    const subtotal = labour + (effectivePart || 0); // no shipping
    const tax = subtotal * GST;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [labour, effectivePart]);

  const fmt = (n: number) => `$${n.toFixed(2)}`;

  const handlePartInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onPartChange) return;
    const raw = e.currentTarget.value.trim();
    if (raw === "") return onPartChange(key, undefined); // clears override
    const num = Number(raw);
    onPartChange(key, Number.isFinite(num) ? num : undefined);
  };

  const etaText =
    eta ??
    (labour <= 40
      ? "30–60 min"
      : labour <= 80
      ? "1–2 hours"
      : "Same day or next business day");

  return (
    <div className="service-details">
      {/* DESCRIPTION */}
      {desc && <p className="desc">{desc}</p>}

      {/* CORE BREAKDOWN */}
      <div className="details-grid">
        <div className="row">
          <span className="label">Addon</span>
          <span className="value">{label}</span>
        </div>

        <div className="row">
          <span className="label">Labour</span>
          <span className="value">{fmt(labour)}</span>
        </div>

        {/* PARTS (optional) */}
        {showParts && (
          <div className="row parts">
            <span className="label">Parts</span>
            <span className="value">
              <span className="parts-input">
                <input
                  className="part-input no-spin"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  placeholder={(defaultPart ?? 0) > 0 ? String(defaultPart) : "0.00"}
                  value={hasPartOverride ? String(partValue) : ""}
                  onChange={handlePartInput}
                  aria-label={`${label} part price`}
                />
              </span>
            </span>
          </div>
        )}

        <div className="row">
          <span className="label">Subtotal</span>
          <span className="value">{fmt(math.subtotal)}</span>
        </div>

        <div className="row">
          <span className="label">GST (5%)</span>
          <span className="value">{fmt(math.tax)}</span>
        </div>

        <div className="row total">
          <span className="label">Total</span>
          <span className="value">{fmt(math.total)}</span>
        </div>

        <div className="row">
          <span className="label">Time estimate</span>
          <span className="value">{etaText}</span>
        </div>
      </div>

      {/* META */}
      <div className="meta">
        {requiresPart && (
          <div className="meta-item">
            <strong>Parts required:</strong>{" "}
            {showParts ? "Yes (override allowed)" : "Yes (price on request)"}
          </div>
        )}
      </div>
    </div>
  );
}
