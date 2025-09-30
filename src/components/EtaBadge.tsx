import { useCalculator } from "../context/CalculatorContext";

export default function EtaBadge() {
  const { eta } = useCalculator();
  return (
    <div className="small" id="eta">
      <strong>Estimated ready date:</strong> <span id="etaDates">{eta}</span>
      <div className="muted" style={{ marginTop: "6px" }}>
        Assumes parts ETA 7–10 days + 2 days for service work once parts arrive.
      </div>
    </div>
  );
}
