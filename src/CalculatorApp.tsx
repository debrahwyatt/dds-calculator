import { CalculatorProvider } from "./context/CalculatorContext";
import DeviceSelector from "./components/DeviceSelector";
import ServiceList from "./components/ServiceList";
import AddonList from "./components/AddonList";
import TotalsCard from "./components/TotalsCard";
import EtaBadge from "./components/EtaBadge";
import CopySummaryButton from "./components/CopySummaryButton";

export default function CalculatorApp() {
  return (
    <CalculatorProvider>
      <div className="wrap">
        <div className="card">
          <h1>Service + Parts Calculator</h1>
          <div className="grid-cols">
            <div>
              <DeviceSelector />
              <ServiceList />
              <AddonList />
            </div>
            <div>
              <TotalsCard />
              <hr style={{ border: 0, borderTop: "1px solid rgba(0,0,0,.08)", margin: "14px 0" }} />
              <EtaBadge />
              <CopySummaryButton />
            </div>
          </div>
        </div>
      </div>
    </CalculatorProvider>
  );
}
