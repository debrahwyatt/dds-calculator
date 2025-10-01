import PartPriceInput from "./PartPriceInput";
import { useCalculator } from "../context/CalculatorContext";

export default function AddonList() {
  const { addonKeys, toggleAddon, visibleAddons, priceForKey } = useCalculator();

  return (
    <div className="section">
      <h2>Add-On</h2>
      <div className="radio-row">
        {visibleAddons.map(a => {
          const checked = addonKeys.includes(a.key as any);
          const hrs = a.key === "manual" ? "—" : `$${priceForKey(a.key)}`;
          return (
            <label className="radio option" key={a.key}>
              <input
                type="checkbox"
                name={`addon_${a.key}`}
                value={a.key}
                checked={checked}
                onChange={() => toggleAddon(a.key as any)}
              />
              {a.label}
              <span className="muted"> · <span className="svc-hrs" data-svc={a.key}>{hrs}</span></span>
              {checked && a.requiresPart && <PartPriceInput option={a} />}
            </label>
          );
        })}
      </div>

      <div style={{ marginTop: "12px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <span className="pill">Labor rate: <strong>$80/hr</strong></span>
      </div>
    </div>
  );
}
