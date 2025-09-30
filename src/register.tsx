import r2wc from "@r2wc/react-to-web-component";
import CalculatorApp from "./CalculatorApp";
import "./index.css";

const DdsCalculator = r2wc(CalculatorApp, { shadow: "open" }); // ← 'open' or 'closed'

if (!customElements.get("dds-calculator")) {
  customElements.define("dds-calculator", DdsCalculator);
}
