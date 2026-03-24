import usePortfolioStore from "@/store/usePortfolioStore";
import { useEffect, useState } from "react";
import PortfolioTable from "@/components/PortfolioTable";
import AddPositionModal from "@/components/AddPositionModal";
import { formatMoney, formatPct } from "@/lib/currency";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#0ea5e9", "#22c55e", "#f59e0b", "#a855f7", "#ef4444", "#06b6d4", "#84cc16"];

export default function Actual() {
  const { load, actual, move, sell, removePosition, addPosition, loading } = usePortfolioStore();
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { load(); }, [load]);

  const positions = actual.positions || [];

  const pieData = positions.map((p) => ({
    name: p.symbol,
    value: p.marketValue || p.currentPrice * p.quantity,
  }));

  return (
    <div className="space-y-5">
      {showAdd && (
        <AddPositionModal
          portfolioType="actual"
          onClose={() => setShowAdd(false)}
          onAdd={addPosition}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Actual Portfolio</h1>
          <p className="text-sm text-slate-500 mt-0.5">Your live investment positions</p>
        </div>
        <button className="btn" onClick={() => setShowAdd(true)}>+ Add Position</button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Market Value", val: formatMoney(actual.totalValue), sub: null },
          { label: "Cost Basis", val: formatMoney(actual.totalCost), sub: null },
          { label: "Unrealised P/L", val: formatMoney(actual.totalPl), up: actual.totalPl >= 0 },
          { label: "Total Return", val: formatPct(actual.totalPlPercent), up: actual.totalPlPercent >= 0 },
        ].map(({ label, val, sub, up }) => (
          <div key={label} className="card-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-lg font-bold tabular-nums ${up === undefined ? "text-slate-100" : up ? "text-emerald-400" : "text-red-400"}`}>
              {val}
            </p>
          </div>
        ))}
      </div>

      {/* Table + chart */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-200">Positions</h2>
            {loading && <span className="text-xs text-slate-500">Refreshing…</span>}
          </div>
          <PortfolioTable
            portfolio={actual}
            onSell={(p) => sell(p)}
            onMove={(p) => move(p)}
            onRemove={(p) => removePosition("actual", p)}
          />
        </div>

        {pieData.length > 0 && (
          <div className="card">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Allocation</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip
                  formatter={(v) => formatMoney(v)}
                  contentStyle={{ background: "#0d1626", border: "1px solid #1e2d45", borderRadius: 8, fontSize: 12 }}
                  itemStyle={{ color: "#cbd5e1" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {pieData.map((d, i) => {
                const total = pieData.reduce((s, x) => s + x.value, 0);
                return (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-slate-400 w-14 truncate">{d.name}</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-1">
                      <div className="h-1 rounded-full" style={{ width: `${(d.value / total) * 100}%`, background: COLORS[i % COLORS.length] }} />
                    </div>
                    <span className="text-slate-500 w-10 text-right">{((d.value / total) * 100).toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
