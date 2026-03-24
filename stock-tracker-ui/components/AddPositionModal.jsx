import { useState } from "react";

const EXCHANGES = [
  { value: "NASDAQ", label: "NASDAQ (US)", region: "us" },
  { value: "NYSE", label: "NYSE (US)", region: "us" },
  { value: "NSE", label: "NSE (India)", region: "india" },
];

export default function AddPositionModal({ portfolioType, onClose, onAdd }) {
  const [form, setForm] = useState({ symbol: "", exchange: "NASDAQ", quantity: "", averagePrice: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.symbol.trim()) return setError("Symbol is required");
    if (!form.quantity || Number(form.quantity) <= 0) return setError("Quantity must be positive");
    if (!form.averagePrice || Number(form.averagePrice) <= 0) return setError("Price must be positive");

    const exchange = EXCHANGES.find((x) => x.value === form.exchange);
    setLoading(true);
    try {
      await onAdd(portfolioType, {
        symbol: form.symbol.trim().toUpperCase(),
        exchange: form.exchange,
        region: exchange?.region || "us",
        quantity: parseInt(form.quantity),
        averagePrice: parseFloat(form.averagePrice),
      });
      onClose();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to add position");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-100">Add Position</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors text-xl leading-none">×</button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">Symbol</label>
            <input
              className="input"
              placeholder="e.g. AAPL, INFY"
              value={form.symbol}
              onChange={(e) => set("symbol", e.target.value.toUpperCase())}
              autoFocus
            />
          </div>

          <div>
            <label className="label">Exchange</label>
            <select
              className="input"
              value={form.exchange}
              onChange={(e) => set("exchange", e.target.value)}
            >
              {EXCHANGES.map((ex) => (
                <option key={ex.value} value={ex.value}>{ex.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Quantity</label>
              <input
                className="input"
                type="number"
                min="1"
                step="1"
                placeholder="100"
                value={form.quantity}
                onChange={(e) => set("quantity", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Avg Buy Price</label>
              <input
                className="input"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="150.00"
                value={form.averagePrice}
                onChange={(e) => set("averagePrice", e.target.value)}
              />
            </div>
          </div>

          {form.quantity && form.averagePrice && (
            <div className="bg-slate-800/50 rounded-lg px-3 py-2 text-sm text-slate-400">
              Total cost:{" "}
              <span className="text-slate-200 font-medium">
                {(Number(form.quantity) * Number(form.averagePrice)).toLocaleString("en-US", {
                  style: "currency",
                  currency: form.exchange === "NSE" ? "INR" : "USD",
                })}
              </span>
            </div>
          )}

          {error && <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="submit" className="btn flex-1" disabled={loading}>
              {loading ? "Adding…" : "Add Position"}
            </button>
            <button type="button" className="btn-ghost flex-1 py-2 rounded-lg border border-[#1e2d45]" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
