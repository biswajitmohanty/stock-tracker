import usePortfolioStore from "@/store/usePortfolioStore";
import { useEffect } from "react";
import PortfolioTable from "@/components/PortfolioTable";

export default function Hypo() {
  const { load, hypothetical } = usePortfolioStore();
  useEffect(() => { load(); }, [load]);
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Hypothetical Portfolio</h1>
      <PortfolioTable title="What-if Positions" portfolio={hypothetical} />
    </div>
  );
}
