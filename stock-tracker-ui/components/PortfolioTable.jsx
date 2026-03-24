import { formatMoney, formatPct } from "@/lib/currency";
import { useState } from "react";
import SellPositionModal from "./SellPositionModal";

export default function PortfolioTable({ portfolio, onMove, onSell, onRemove }) {
  const rows = portfolio?.positions || [];
  const [sellTarget, setSellTarget] = useState(null);

  return (
    <>
      {sellTarget && (
        <SellPositionModal
          position={sellTarget}
          onClose={() => setSellTarget(null)}
          onSell={async (payload) => { await onSell(payload); setSellTarget(null); }}
        />
      )}

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th className="hidden md:table-cell">Name</th>
              <th>Exchange</th>
              <th className="text-right">Qty</th>
              <th className="text-right">Avg Cost</th>
              <th className="text-right">Last Price</th>
              <th className="text-right">Mkt Value</th>
              <th className="text-right">P/L</th>
              <th className="text-right">Return</th>
              {(onMove || onSell || onRemove) && <th className="text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-10 text-slate-500">
                  No positions yet.{" "}
                  <span className="text-sky-400">Add one to get started.</span>
                </td>
              </tr>
            ) : (
              rows.map((p) => {
                const isUp = p.pl >= 0;
                return (
                  <tr key={`${p.symbol}-${p.exchange}`}>
                    <td>
                      <span className="font-semibold text-sky-400">{p.symbol}</span>
                    </td>
                    <td className="hidden md:table-cell text-slate-400 text-xs max-w-[140px] truncate">{p.name || "—"}</td>
                    <td>
                      <span className="badge bg-slate-800/60 text-slate-400 border border-slate-700/30">{p.exchange}</span>
                    </td>
                    <td className="text-right tabular-nums">{p.quantity}</td>
                    <td className="text-right tabular-nums">{formatMoney(p.averagePrice, p.currency)}</td>
                    <td className="text-right tabular-nums font-medium">{formatMoney(p.currentPrice, p.currency)}</td>
                    <td className="text-right tabular-nums">{formatMoney(p.marketValue, p.currency)}</td>
                    <td className={`text-right tabular-nums ${isUp ? "pl-positive" : "pl-negative"}`}>
                      {isUp ? "+" : ""}{formatMoney(p.pl, p.currency)}
                    </td>
                    <td className={`text-right tabular-nums ${isUp ? "pl-positive" : "pl-negative"}`}>
                      {formatPct(p.plPercent)}
                    </td>
                    {(onMove || onSell || onRemove) && (
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onSell && (
                            <button className="btn-danger" onClick={() => setSellTarget(p)}>
                              Sell
                            </button>
                          )}
                          {onMove && (
                            <button className="btn-ghost" onClick={() => onMove({ symbol: p.symbol, exchange: p.exchange })}>
                              → What-If
                            </button>
                          )}
                          {onRemove && (
                            <button className="btn-ghost" onClick={() => onRemove({ symbol: p.symbol, exchange: p.exchange })}>
                              ✕
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
