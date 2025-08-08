import usePortfolioStore from "@/store/usePortfolioStore";
import { useEffect } from "react";
import PortfolioTable from "@/components/PortfolioTable";

export default function Actual() {
  const { load, actual, move } = usePortfolioStore();
  useEffect(() => { load(); }, [load]);
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Actual Portfolio</h1>
      <PortfolioTable title="Live Positions" portfolio={actual} onMove={(p) => move(p)} />
    </div>
  );
}
