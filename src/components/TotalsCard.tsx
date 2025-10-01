// Components/TotalsCard.tsx
import Total from "./Total";

type Props = {
  labour: number;
  parts: number;
  discount: number;
};

export default function TotalsCard({ labour, parts, discount }: Props) {
  const shipping = parts === 0 ? 0 : 10;

  // Discount applies pre-tax
  const subTotal = Math.max(0, labour + parts + shipping - discount);
  const gst = subTotal * 0.05;
  const total = subTotal + gst;

  return (
    <div className="section">
      <h2>Estimate</h2>
      <div className="totals" id="totals">
        <Total label="Labour" value={labour} />
        <Total label="Parts" value={parts} />
        <Total label="Shipping" value={shipping} />
        <Total label="Discount" value={-discount} />
        <Total label="Subtotal" value={subTotal} />
        <Total label="GST" value={Number(gst.toFixed(2))} />
        <Total label="Total" value={Number(total.toFixed(2))} />
      </div>
    </div>
  );
}
