// Components/DeviceSelector.tsx
import { devices, type DeviceKey } from "../Config/config";
import Device from "./Device";

export default function DeviceSelector({
  value,
  onChange,
}: {
  value: DeviceKey;
  onChange: (v: DeviceKey) => void;
}) {
  return (
    <div>
      <h2>Device Type</h2>
      <div>
        {devices.map((d) => (
          <Device key={d.key} device={d} checked={value === d.key} onChange={onChange} />
        ))}
      </div>
    </div>
  );
}
