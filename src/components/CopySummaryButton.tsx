import React from "react";
import { useCalculator } from "../hooks/useCalculator";

export default function CopySummaryButton() {
  const { copySummary } = useCalculator();
  const [label, setLabel] = React.useState("Copy summary");

  const onClick = async () => {
    await copySummary();
    setLabel("Copied!");
    setTimeout(() => setLabel("Copy summary"), 1200);
  };

  return (
    <div className="section" style={{ marginTop: "12px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
      <button className="btn" onClick={onClick}>{label}</button>
      <span className="small">
        Tip: press <code className="inline">Tab</code> to jump fields; values update live.
      </span>
    </div>
  );
}
