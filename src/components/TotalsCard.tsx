import { useCalculator } from "../hooks/useCalculator";

export default function TotalsCard() {
  const { totals } = useCalculator();

  const fmt = (n: number) => n.toLocaleString(undefined, { style: "currency", currency: "CAD" });

  return (
    <div className="section">
      <h2>Estimate</h2>
      <div className="totals" id="totals">
        <div className="row"><span className="label">Parts</span><span className="val" id="partsPre">{fmt(totals.parts)}</span></div>
        <div className="row"><span className="label">Shipping</span><span className="val" id="ship">{fmt(totals.shipping)}</span></div>
        <div className="row">
          <span className="label" id="laborLabel">
            Labor ({totals.hours.toFixed(2)} hour(s) × $80)
          </span>
          <span className="val" id="labor">{fmt(totals.labor)}</span>
        </div>
        <div className="row"><span className="label" id="subTotalLabel">Subtotal</span><span className="val" id="subTotal">{fmt(totals.subtotal)}</span></div>
        <div className="row"><span className="label">GST 5%</span><span className="val" id="gst">{fmt(totals.gst)}</span></div>
        <div className="row emph"><span className="label">Grand total (estimate)</span><span className="val" id="grand">{fmt(totals.grand)}</span></div>
      </div>
    </div>
  );
}
