import { useRouter } from "next/router";
import { useState } from "react";
import { fetchStock } from "@/lib/api";
import { formatMoney, formatPct } from "@/lib/currency";
import usePortfolioStore from "@/store/usePortfolioStore";
import AddPositionModal from "@/components/AddPositionModal";

const REGION_LABELS = { us: "United States", india: "India" };

export default function RegionPage() {
  const { query } = useRouter();
  const region = (query.region || "").toString();
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const { addPosition } = usePortfolioStore();

  const onLookup = async (e) => {
    e.preventDefault();
    if (!symbol.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await fetchStock(region, symbol.trim().toUpperCase());
      setData(result);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to fetch quote");
    } finally {
      setLoading(false);
    }
  };

  const changeColor = data && data.change != null
    ? data.change >= 0 ? "text-emerald-400" : "text-red-400"
    : "text-slate-400";

  return (
    <div className="space-y-5">
      {showAdd && data && (
        <AddPositionModal
          portfolioType="actual"
          onClose={() => setShowAdd(false)}
          onAdd={addPosition}
        />
      )}

      {/* Header */}
      <div>
        <p className="text-xs text-slate-500 mb-1">Markets</p>
        <h1 className="text-xl font-bold text-slate-100">{REGION_LABELS[region] || region} Market</h1>
        <p className="text-sm text-slate-500 mt-0.5">Real-time stock quote lookup</p>
      </div>

      {/* Search form */}
      <div className="card">
        <form onSubmit={onLookup} className="flex gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-40">
            <label className="label">Ticker Symbol</label>
            <input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="input"
              placeholder={region === "india" ? "e.g. INFY, TCS, RELIANCE" : "e.g. AAPL, TSLA, MSFT"}
            />
          </div>
          <button className="btn" type="submit" disabled={loading || !symbol.trim()}>
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Fetching…
              </span>
            ) : "Get Quote"}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900/20 border border-red-800/30 rounded-xl px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Quote result */}
      {data && (
        <div className="card space-y-4">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-sky-400">{data.symbol}</span>
                <span className="badge bg-slate-800/60 text-slate-400 border border-slate-700/30">{data.exchange}</span>
                <span className="badge bg-slate-800/60 text-slate-400 border border-slate-700/30">{data.currency}</span>
              </div>
              <p className="text-slate-400 text-sm mt-1">{data.name}</p>
              <p className="text-xs text-slate-600 mt-0.5">{data.country}</p>
            </div>
            <button className="btn" onClick={() => setShowAdd(true)}>
              + Add to Portfolio
            </button>
          </div>

          {/* Price block */}
          <div className="bg-slate-800/30 rounded-xl p-4">
            <div className="flex items-end gap-4 flex-wrap">
              <div>
                <p className="text-xs text-slate-500 mb-1">Last Price</p>
                <p className="text-3xl font-bold tabular-nums text-slate-100">
                  {formatMoney(data.currentPrice, data.currency)}
                </p>
              </div>
              {data.change != null && (
                <div className={changeColor}>
                  <p className="text-xs text-slate-500 mb-1">Change</p>
                  <p className="text-lg font-semibold tabular-nums">
                    {data.change >= 0 ? "+" : ""}{formatMoney(data.change, data.currency)}
                    {data.changePercent != null && (
                      <span className="text-sm ml-2">({formatPct(data.changePercent)})</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Extra fields if available */}
          {(data.high || data.low || data.open || data.volume) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Open", val: formatMoney(data.open, data.currency) },
                { label: "High", val: formatMoney(data.high, data.currency) },
                { label: "Low", val: formatMoney(data.low, data.currency) },
                { label: "Volume", val: data.volume != null ? Number(data.volume).toLocaleString() : "—" },
              ].map(({ label, val }) => (
                <div key={label} className="bg-slate-800/30 rounded-lg p-3">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="text-sm font-medium text-slate-200 tabular-nums mt-0.5">{val}</p>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-slate-600">
            Last updated: {data.lastUpdatedAt ? new Date(data.lastUpdatedAt).toLocaleTimeString() : "—"}
          </p>
        </div>
      )}
    </div>
  );
}
