import usePortfolioStore from "@/store/usePortfolioStore";
import { useEffect, useState } from "react";
import PortfolioTable from "@/components/PortfolioTable";
import AddPositionModal from "@/components/AddPositionModal";
import { formatMoney, formatPct } from "@/lib/currency";

export default function Hypo() {
  const { load, hypothetical, addPosition, removePosition, loading } = usePortfolioStore();
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-5">
      {showAdd && (
        <AddPositionModal
          portfolioType="hypothetical"
          onClose={() => setShowAdd(false)}
          onAdd={addPosition}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100">What-If Portfolio</h1>
          <p className="text-sm text-slate-500 mt-0.5">Explore hypothetical investment scenarios</p>
        </div>
        <button className="btn" onClick={() => setShowAdd(true)}>+ Add Position</button>
      </div>

      {/* Info banner */}
      <div className="bg-sky-900/20 border border-sky-800/30 rounded-xl px-4 py-3 text-sm text-sky-300">
        Positions here don&apos;t affect your actual portfolio. Use them to simulate what could have happened.
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Market Value", val: formatMoney(hypothetical.totalValue) },
          { label: "Cost Basis", val: formatMoney(hypothetical.totalCost) },
          { label: "Hypothetical P/L", val: formatMoney(hypothetical.totalPl), up: hypothetical.totalPl >= 0 },
          { label: "Hypothetical Return", val: formatPct(hypothetical.totalPlPercent), up: hypothetical.totalPlPercent >= 0 },
        ].map(({ label, val, up }) => (
          <div key={label} className="card-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-lg font-bold tabular-nums ${up === undefined ? "text-slate-100" : up ? "text-emerald-400" : "text-red-400"}`}>
              {val}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-200">What-If Positions</h2>
          {loading && <span className="text-xs text-slate-500">Refreshing…</span>}
        </div>
        <PortfolioTable
          portfolio={hypothetical}
          onRemove={(p) => removePosition("hypothetical", p)}
        />
      </div>
    </div>
  );
}
