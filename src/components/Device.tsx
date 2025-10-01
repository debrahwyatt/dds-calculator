// Components/Device.tsx
import type { DeviceDef, DeviceKey } from "../Config/config";

export default function Device({
  device,
  name = "devtype",
  checked,
  onChange,
}: {
  device: DeviceDef;
  name?: string;
  checked: boolean;
  onChange: (key: DeviceKey) => void;
}) {
  return (
    <label className="option">
      <input
        type="radio"
        name={name}
        value={device.key}
        checked={checked}
        onChange={() => onChange(device.key)}
      />
      {device.label}
    </label>
  );
}
