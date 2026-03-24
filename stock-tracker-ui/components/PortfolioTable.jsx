import { formatMoney, formatPct } from "@/lib/currency";
import { useState } from "react";
import SellPositionModal from "./SellPositionModal";

export default function PortfolioTable({ portfolio, onMove, onSell, onRemove }) {
  const rows = portfolio?.positions || [];
  const [sellTarget, setSellTarget] = useState(null);

  const handleSell = async (payload) => {
    await onSell(payload);
    setSellTarget(null);
  };

  if (rows.length === 0) {
    return (
      <div className="py-10 text-center text-slate-500 text-sm">
        No positions yet.{" "}
        <span className="text-sky-400">Add one to get started.</span>
      </div>
    );
  }

  return (
    <>
      {sellTarget && (
        <SellPositionModal
          position={sellTarget}
          onClose={() => setSellTarget(null)}
          onSell={handleSell}
        />
      )}

      {/* ── Mobile card list (hidden on md+) ── */}
      <div className="md:hidden space-y-3">
        {rows.map((p) => {
          const isUp = p.pl >= 0;
          return (
            <div key={`${p.symbol}-${p.exchange}`} className="bg-[#111d30] border border-[#1e2d45] rounded-xl p-4">
              {/* Row 1: symbol + exchange + P/L% */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="font-bold text-sky-400 text-base">{p.symbol}</span>
                  <span className="ml-2 badge bg-slate-800/60 text-slate-400 border border-slate-700/30 text-xs">
                    {p.exchange}
                  </span>
                  {p.name && <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[180px]">{p.name}</p>}
                </div>
                <span className={`text-sm font-semibold tabular-nums ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                  {formatPct(p.plPercent)}
                </span>
              </div>

              {/* Row 2: price grid */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Qty</p>
                  <p className="text-sm font-medium text-slate-200 tabular-nums">{p.quantity}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Avg Cost</p>
                  <p className="text-sm font-medium text-slate-200 tabular-nums">{formatMoney(p.averagePrice, p.currency)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Last Price</p>
                  <p className="text-sm font-bold text-slate-100 tabular-nums">{formatMoney(p.currentPrice, p.currency)}</p>
                </div>
              </div>

              {/* Row 3: market value + P/L */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Market Value</p>
                  <p className="text-sm font-medium text-slate-200 tabular-nums">{formatMoney(p.marketValue, p.currency)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-0.5">Unrealised P/L</p>
                  <p className={`text-sm font-semibold tabular-nums ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                    {isUp ? "+" : ""}{formatMoney(p.pl, p.currency)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {(onSell || onMove || onRemove) && (
                <div className="flex items-center gap-2 pt-2 border-t border-[#1e2d45]">
                  {onSell && (
                    <button className="btn-danger flex-1 py-1.5 text-xs rounded-lg" onClick={() => setSellTarget(p)}>
                      Sell
                    </button>
                  )}
                  {onMove && (
                    <button className="btn-ghost flex-1 py-1.5 text-xs rounded-lg border border-[#1e2d45]"
                      onClick={() => onMove({ symbol: p.symbol, exchange: p.exchange })}>
                      → What-If
                    </button>
                  )}
                  {onRemove && (
                    <button className="btn-ghost px-3 py-1.5 text-xs rounded-lg border border-[#1e2d45]"
                      onClick={() => onRemove({ symbol: p.symbol, exchange: p.exchange })}>
                      ✕
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Desktop table (hidden below md) ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th className="hidden lg:table-cell">Name</th>
              <th>Exchange</th>
              <th className="text-right">Qty</th>
              <th className="text-right">Avg Cost</th>
              <th className="text-right">Last Price</th>
              <th className="text-right hidden lg:table-cell">Mkt Value</th>
              <th className="text-right">P/L</th>
              <th className="text-right">Return</th>
              {(onMove || onSell || onRemove) && <th className="text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const isUp = p.pl >= 0;
              return (
                <tr key={`${p.symbol}-${p.exchange}`}>
                  <td><span className="font-semibold text-sky-400">{p.symbol}</span></td>
                  <td className="hidden lg:table-cell text-slate-400 text-xs max-w-[140px] truncate">{p.name || "—"}</td>
                  <td>
                    <span className="badge bg-slate-800/60 text-slate-400 border border-slate-700/30">{p.exchange}</span>
                  </td>
                  <td className="text-right tabular-nums">{p.quantity}</td>
                  <td className="text-right tabular-nums">{formatMoney(p.averagePrice, p.currency)}</td>
                  <td className="text-right tabular-nums font-medium">{formatMoney(p.currentPrice, p.currency)}</td>
                  <td className="text-right tabular-nums hidden lg:table-cell">{formatMoney(p.marketValue, p.currency)}</td>
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
                          <button className="btn-danger" onClick={() => setSellTarget(p)}>Sell</button>
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
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
