import PartPriceInput from "./PartPriceInput";
import { useCalculator } from "../hooks/useCalculator";
import { DEFAULT_HOURS } from "../engine/hours";

export default function ServiceList() {
  const {
    device,
    serviceKey,
    setServiceKey,
    visibleServices,
    manualHours,
    setManualHours,
  } = useCalculator();

  // helper to show preset hours on each service row
  const hoursFor = (key: string) =>
    key === "manual" ? "—" : (DEFAULT_HOURS[device]?.[key] ?? 0).toFixed(2) + " hr";

  return (
    <div className="section">
      <h2>Service Type</h2>
      <div className="radio-row">
        {visibleServices.map(s => (
          <label className="radio option" key={s.key}>
            <input
              type="radio"
              name="service"
              value={s.key}
              checked={serviceKey === s.key}
              onChange={() => setServiceKey(s.key as any)}
            />
            {s.label}
            <span className="muted"> · <span className="svc-hrs" data-svc={s.key}>{hoursFor(s.key)}</span></span>

            {/* Part input only when this option is selected */}
            {serviceKey === s.key && s.requiresPart && <PartPriceInput option={s} />}
          </label>
        ))}

        {/* Manual hours input */}
        {serviceKey === "manual" && (
          <div id="manualHoursWrap" style={{ marginTop: "12px" }}>
            <label htmlFor="manualHours">Custom labor hours</label>
            <input
              type="number"
              id="manualHours"
              min={0}
              step={0.25}
              value={manualHours}
              onChange={e => setManualHours(Number(e.target.value))}
              placeholder="e.g., 1.0"
            />
          </div>
        )}
      </div>

      <div style={{ marginTop: "12px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <span className="pill">Labor rate: <strong>$80/hr</strong></span>
      </div>
    </div>
  );
}
