import { useCalculator } from "../context/CalculatorContext";

export default function DeviceSelector() {
  const { device, setDevice } = useCalculator();
  const devices = [
    { key: "pc", label: "PC / Desktop" },
    { key: "laptop", label: "Laptop" },
    { key: "mobile", label: "Mobile" },
  ] as const;

  return (
    <div className="section">
      <h2>Device Type</h2>
      <div className="radio-row">
        {devices.map(d => (
          <label className="radio" key={d.key}>
            <input
              type="radio"
              name="devtype"
              value={d.key}
              checked={device === d.key}
              onChange={() => setDevice(d.key as any)}
            />
            {d.label}
          </label>
        ))}
      </div>
    </div>
  );
}
