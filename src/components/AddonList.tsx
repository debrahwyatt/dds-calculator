import PartPriceInput from "./PartPriceInput";
import { useCalculator } from "../context/CalculatorContext";

export default function AddonList() {
  const { addonKeys, toggleAddon, visibleAddons } = useCalculator();

  return (
    <div className="section">
      <h2>Add-On</h2>
      <div className="radio-row">
        {visibleAddons.map(a => {
          const checked = addonKeys.includes(a.key as any);
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
