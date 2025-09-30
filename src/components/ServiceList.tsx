import PartPriceInput from "./PartPriceInput";
import { useCalculator } from "../context/CalculatorContext";

export default function ServiceList() {
  const {
    device,
    serviceKeys,
    toggleService,
    visibleServices,
    manualHours,
    setManualHours,
    priceForKey,
  } = useCalculator();

  return (
    <div className="section">
      <h2>Service Type</h2>
      <div className="radio-row">
        {visibleServices.map(s => {
          const checked = serviceKeys.includes(s.key as any);
          const hrs = s.key === "manual" ? "—" : `$${priceForKey(s.key)}`;
          return (
            <label className="radio option" key={s.key}>
              <input
                type="checkbox"
                name={`service_${s.key}`}
                value={s.key}
                checked={checked}
                onChange={() => toggleService(s.key as any)}
              />
              {s.label}
              <span className="muted"> · <span className="svc-hrs" data-svc={s.key}>{hrs}</span></span>

              {/* show part input if this box is checked and requires a part */}
              {checked && s.requiresPart && <PartPriceInput option={s} />}
            </label>
          );
        })}

        {/* Manual hours input when 'manual' is selected */}
        {serviceKeys.includes("manual" as any) && (
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
