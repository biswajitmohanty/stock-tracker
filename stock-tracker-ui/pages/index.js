import usePortfolioStore from "@/store/usePortfolioStore";
import { useEffect } from "react";
import Link from "next/link";
import { formatMoney, formatPct } from "@/lib/currency";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#0ea5e9", "#22c55e", "#f59e0b", "#a855f7", "#ef4444", "#06b6d4", "#84cc16"];

function StatCard({ label, value, sub, change, changeLabel }) {
  const isPositive = change >= 0;
  return (
    <div className="card">
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-100 tabular-nums">{value}</p>
      {(change != null || sub) && (
        <p className={`text-xs mt-1 ${change != null ? (isPositive ? "text-emerald-400" : "text-red-400") : "text-slate-500"}`}>
          {change != null ? (isPositive ? "▲" : "▼") + " " + Math.abs(change).toFixed(2) + "%" : ""}{" "}
          {changeLabel || sub}
        </p>
      )}
    </div>
  );
}

function AllocationChart({ positions }) {
  if (!positions || positions.length === 0) return null;
  const data = positions.map((p) => ({
    name: p.symbol,
    value: p.marketValue || p.currentPrice * p.quantity,
  }));
  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Portfolio Allocation</h3>
      <div className="flex items-center gap-6">
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => formatMoney(v)}
              contentStyle={{ background: "#0d1626", border: "1px solid #1e2d45", borderRadius: 8, fontSize: 12 }}
              itemStyle={{ color: "#cbd5e1" }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {data.map((d, i) => {
            const total = data.reduce((s, x) => s + x.value, 0);
            const pct = total > 0 ? (d.value / total) * 100 : 0;
            return (
              <div key={d.name} className="flex items-center gap-2 text-sm">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-slate-300 font-medium w-16 truncate">{d.name}</span>
                <div className="flex-1 bg-slate-800 rounded-full h-1.5 mx-1">
                  <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
                </div>
                <span className="text-slate-400 text-xs tabular-nums w-10 text-right">{pct.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { load, actual, hypothetical, loading } = usePortfolioStore();
  useEffect(() => { load(); }, [load]);

  const totalPositions = (actual.positions?.length || 0) + (hypothetical.positions?.length || 0);
  const allPositions = [...(actual.positions || []), ...(hypothetical.positions || [])];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track your investment portfolio in real time</p>
        </div>
        {loading && (
          <span className="flex items-center gap-2 text-sm text-slate-500">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            Refreshing…
          </span>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Actual Portfolio"
          value={formatMoney(actual.totalValue || 0)}
          change={actual.totalPlPercent}
          changeLabel="overall return"
        />
        <StatCard
          label="Unrealised P/L"
          value={formatMoney(actual.totalPl || 0)}
          change={actual.totalPlPercent}
          changeLabel="vs cost basis"
        />
        <StatCard
          label="What-If Portfolio"
          value={formatMoney(hypothetical.totalValue || 0)}
          sub="Hypothetical scenario"
        />
        <StatCard
          label="Total Positions"
          value={totalPositions}
          sub={`${actual.positions?.length || 0} actual · ${hypothetical.positions?.length || 0} hypothetical`}
        />
      </div>

      {/* Allocation chart + quick actions */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <AllocationChart positions={actual.positions} />
        </div>
        <div className="card flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-slate-300">Quick Actions</h3>
          <Link href="/portfolios/actual" className="btn w-full text-center">
            View Actual Portfolio
          </Link>
          <Link href="/portfolios/hypothetical" className="btn-ghost w-full text-center text-sm py-2 rounded-lg border border-[#1e2d45] hover:border-slate-600 transition-colors">
            View What-If Portfolio
          </Link>
          <Link href="/markets" className="btn-ghost w-full text-center text-sm py-2 rounded-lg border border-[#1e2d45] hover:border-slate-600 transition-colors">
            Browse Markets
          </Link>
          <Link href="/history" className="btn-ghost w-full text-center text-sm py-2 rounded-lg border border-[#1e2d45] hover:border-slate-600 transition-colors">
            Trade History
          </Link>
        </div>
      </div>

      {/* Top movers */}
      {actual.positions?.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Actual Positions Snapshot</h3>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Name</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Mkt Value</th>
                  <th className="text-right">P/L</th>
                  <th className="text-right">Return</th>
                </tr>
              </thead>
              <tbody>
                {actual.positions.map((p) => (
                  <tr key={`${p.symbol}-${p.exchange}`}>
                    <td className="font-semibold text-sky-400">{p.symbol}</td>
                    <td className="text-slate-400 text-xs">{p.name || p.exchange}</td>
                    <td className="text-right tabular-nums">{formatMoney(p.currentPrice, p.currency)}</td>
                    <td className="text-right tabular-nums">{formatMoney(p.marketValue, p.currency)}</td>
                    <td className={`text-right tabular-nums ${p.pl >= 0 ? "pl-positive" : "pl-negative"}`}>
                      {p.pl >= 0 ? "+" : ""}{formatMoney(p.pl, p.currency)}
                    </td>
                    <td className={`text-right tabular-nums ${p.plPercent >= 0 ? "pl-positive" : "pl-negative"}`}>
                      {formatPct(p.plPercent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
