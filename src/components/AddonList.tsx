import PartPriceInput from "./PartPriceInput";
import { useCalculator } from "../hooks/useCalculator";

export default function AddonList() {
  const { addonKey, setAddonKey, visibleAddons } = useCalculator();

  return (
    <div className="section">
      <h2>Add-On</h2>
      <div className="radio-row">
        {visibleAddons.map(a => (
          <label className="radio option" key={a.key}>
            <input
              type="radio"
              name="addon"
              value={a.key}
              checked={addonKey === a.key}
              onChange={() => setAddonKey(a.key as any)}
            />
            {a.label}
            {addonKey === a.key && a.requiresPart && <PartPriceInput option={a} />}
          </label>
        ))}
      </div>

      <div style={{ marginTop: "12px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <span className="pill">Labor rate: <strong>$80/hr</strong></span>
      </div>
    </div>
  );
}
