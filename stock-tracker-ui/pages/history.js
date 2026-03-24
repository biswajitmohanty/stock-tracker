import usePortfolioStore from "@/store/usePortfolioStore";
import { useEffect } from "react";
import { formatMoney } from "@/lib/currency";

const TYPE_BADGE = {
  BUY:      { label: "BUY",      cls: "badge-buy"    },
  SELL:     { label: "SELL",     cls: "badge-sell"   },
  MOVE_OUT: { label: "MOVE OUT", cls: "badge-move"   },
  MOVE_IN:  { label: "MOVE IN",  cls: "badge-move"   },
  REMOVE:   { label: "REMOVE",   cls: "badge-remove" },
};

function formatDate(str) {
  if (!str) return "—";
  const d = new Date(str);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function History() {
  const { loadHistory, history, historyLoading } = usePortfolioStore();
  useEffect(() => { loadHistory(); }, [loadHistory]);

  const totalBought = history.filter(t => t.tradeType === "BUY").reduce((s, t) => s + (t.totalValue || 0), 0);
  const totalSold = history.filter(t => t.tradeType === "SELL").reduce((s, t) => s + (t.totalValue || 0), 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Trade History</h1>
          <p className="text-sm text-slate-500 mt-0.5">All recorded portfolio activity</p>
        </div>
        <button className="btn-ghost px-3 py-1.5 rounded-lg border border-[#1e2d45] text-sm"
          onClick={() => loadHistory()}>
          ↻ Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Trades", val: history.length },
          { label: "Buys", val: history.filter(t => t.tradeType === "BUY").length },
          { label: "Sells", val: history.filter(t => t.tradeType === "SELL").length },
          { label: "Net Invested", val: formatMoney(totalBought - totalSold) },
        ].map(({ label, val }) => (
          <div key={label} className="card-sm">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{label}</p>
            <p className="text-xl font-bold text-slate-100 tabular-nums">{val}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        {historyLoading ? (
          <div className="py-10 text-center text-slate-500">Loading history…</div>
        ) : history.length === 0 ? (
          <div className="py-10 text-center text-slate-500">
            No trades recorded yet. Add positions or sell to see activity here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Symbol</th>
                  <th className="hidden md:table-cell">Name</th>
                  <th className="hidden md:table-cell">Exchange</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Total Value</th>
                  <th className="hidden lg:table-cell">Portfolio</th>
                  <th className="hidden lg:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody>
                {history.map((t) => {
                  const badge = TYPE_BADGE[t.tradeType] || { label: t.tradeType, cls: "badge-remove" };
                  return (
                    <tr key={t.id}>
                      <td className="text-xs text-slate-400 whitespace-nowrap">{formatDate(t.tradeDate)}</td>
                      <td>
                        <span className={`badge ${badge.cls}`}>{badge.label}</span>
                      </td>
                      <td className="font-semibold text-sky-400">{t.symbol}</td>
                      <td className="hidden md:table-cell text-slate-400 text-xs">{t.stockName || "—"}</td>
                      <td className="hidden md:table-cell">
                        <span className="badge bg-slate-800/60 text-slate-400 border border-slate-700/30">{t.exchange}</span>
                      </td>
                      <td className="text-right tabular-nums">{t.quantity}</td>
                      <td className="text-right tabular-nums">{formatMoney(t.price, t.currency)}</td>
                      <td className={`text-right tabular-nums font-medium ${
                        t.tradeType === "SELL" ? "text-emerald-400" : t.tradeType === "BUY" ? "text-sky-400" : "text-slate-300"
                      }`}>
                        {t.tradeType === "SELL" ? "+" : t.tradeType === "BUY" ? "-" : ""}
                        {formatMoney(t.totalValue, t.currency)}
                      </td>
                      <td className="hidden lg:table-cell text-xs text-slate-500 capitalize">{t.portfolioType}</td>
                      <td className="hidden lg:table-cell text-xs text-slate-500">{t.notes || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
