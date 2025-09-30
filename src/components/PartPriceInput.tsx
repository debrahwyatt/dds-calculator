import type { OptionMeta } from "../config/services";
import { useCalculator } from "../hooks/useCalculator";

interface Props {
  option: OptionMeta;
}

export default function PartPriceInput({ option }: Props) {
  const { device, partInputs, setPart } = useCalculator();

  if (!option.requiresPart) return null;

  const defaultPart =
    typeof option.defaultPart === "number"
      ? option.defaultPart
      : option.defaultPart?.[device] ?? 0;

  return (
    <div className="part-ui">
      <span className="small">Part price:</span>
      <input
        type="number"
        min={0}
        step={1}
        value={partInputs[option.key] ?? ""}
        onChange={(e) =>
          setPart(option.key, e.target.value === "" ? undefined : Number(e.target.value))
        }
        placeholder={`Default: ${defaultPart}`}
      />
    </div>
  );
}
