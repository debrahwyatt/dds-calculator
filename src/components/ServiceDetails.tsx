// Components/ServiceDetails.tsx
import { useMemo } from "react";
import type { ItemDef, DeviceKey } from "../Config/config";
import { labourFor, partPriceFor } from "../Config/config";

const GST = 0.05;

export default function ServiceDetails({
  service,
  device,
  partValue,
  onPartChange,
  description, // optional override
  eta,         // optional override
}: {
  service: ItemDef;
  device: DeviceKey;
  partValue?: number;
  onPartChange?: (key: string, value?: number) => void;
  description?: string;
  eta?: string;
  teardownPeersSelected?: number;
}) {
  const { key, label, requiresPart } = service;

  // Lookups from config (per device)
  const labour = labourFor(service, device);
  const defaultPart = partPriceFor(service, device);

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

  // Pull desc/eta from config, allow prop overrides
  const descText = description ?? service.desc;
  const etaText =
    eta ??
    service.eta ??
    (labour <= 80
      ? "Same day (subject to parts availability)"
      : labour <= 160
      ? "Same day or next business day"
      : "1–3 business days");

  return (
    <div className="service-details">
      {/* DESCRIPTION (from config, if present) */}
      {descText && <p className="desc">{descText}</p>}

      {/* CORE BREAKDOWN */}
      <div className="details-grid">
        <div className="row">
          <span className="label">Labour</span>
          <span className="value">{fmt(labour)}</span>
        </div>

        {/* PARTS: only render when showParts === true */}
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
                {/* Only show the default hint when there is NO override */}
                {!hasPartOverride && (
                <span className="hint">
                    Default for {device}: {fmt(defaultPart || 0)}
                </span>
                )}
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
          <span className="label"><b>Total</b></span>
          <span className="value"><b>{fmt(math.total)}</b></span>
        </div>

        <div className="row">
          <span className="label">Time estimate</span>
          <span className="value">{etaText}</span>
        </div>
      </div>

    </div>
  );
}
