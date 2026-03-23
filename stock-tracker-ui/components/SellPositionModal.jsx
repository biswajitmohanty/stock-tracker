import { useState } from "react";
import { formatMoney, formatPct } from "@/lib/currency";

export default function SellPositionModal({ position, onClose, onSell }) {
  const [quantity, setQuantity] = useState("");
  const [sellPrice, setSellPrice] = useState(position.currentPrice?.toString() || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const qty = quantity ? parseInt(quantity) : position.quantity;
  const price = parseFloat(sellPrice) || position.currentPrice;
  const proceeds = qty * price;
  const cost = qty * position.averagePrice;
  const pl = proceeds - cost;
  const plPct = cost > 0 ? (pl / cost) * 100 : 0;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const sellQty = quantity ? parseInt(quantity) : null;
    if (sellQty !== null && (sellQty <= 0 || sellQty > position.quantity))
      return setError(`Quantity must be between 1 and ${position.quantity}`);

    setLoading(true);
    try {
      await onSell({
        symbol: position.symbol,
        exchange: position.exchange,
        quantity: sellQty,
        sellPrice: parseFloat(sellPrice) || null,
      });
      onClose();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to sell position");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-100">
            Sell <span className="text-sky-400">{position.symbol}</span>
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors text-xl leading-none">×</button>
        </div>

        {/* Position summary */}
        <div className="bg-slate-800/40 rounded-lg p-3 mb-4 grid grid-cols-3 gap-2 text-sm">
          <div>
            <p className="text-slate-500 text-xs">Held</p>
            <p className="text-slate-200 font-medium">{position.quantity} shares</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs">Avg Cost</p>
            <p className="text-slate-200 font-medium">{formatMoney(position.averagePrice, position.currency)}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs">Last Price</p>
            <p className="text-slate-200 font-medium">{formatMoney(position.currentPrice, position.currency)}</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Quantity (blank = all)</label>
              <input
                className="input"
                type="number"
                min="1"
                max={position.quantity}
                step="1"
                placeholder={`Max ${position.quantity}`}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Sell Price</label>
              <input
                className="input"
                type="number"
                min="0.01"
                step="0.01"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
              />
            </div>
          </div>

          {/* P/L preview */}
          <div className="bg-slate-800/40 rounded-lg p-3 text-sm space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Proceeds</span>
              <span className="tabular-nums text-slate-200">{formatMoney(proceeds, position.currency)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Cost basis</span>
              <span className="tabular-nums text-slate-200">{formatMoney(cost, position.currency)}</span>
            </div>
            <div className="border-t border-slate-700 pt-1 flex justify-between font-medium">
              <span className="text-slate-300">Realised P/L</span>
              <span className={`tabular-nums ${pl >= 0 ? "pl-positive" : "pl-negative"}`}>
                {pl >= 0 ? "+" : ""}{formatMoney(pl, position.currency)} ({formatPct(plPct)})
              </span>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="submit" className="btn-danger flex-1 py-2 rounded-lg text-sm font-medium" disabled={loading}>
              {loading ? "Selling…" : "Confirm Sell"}
            </button>
            <button type="button" className="btn-ghost flex-1 py-2 rounded-lg border border-[#1e2d45] text-sm" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
