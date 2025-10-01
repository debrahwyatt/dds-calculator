type Props = {
  label: string;
  value: number;
};

export default function Total({ label, value }: Props) {
  return (
    <div className="row">
        <span className="label" id={{label} + "Label"}>{label}</span>
        <span className="val" id={label}>${value.toFixed(2)}</span>
    </div>
  );
}
