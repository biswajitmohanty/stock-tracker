import { useRouter } from "next/router";
import { useState } from "react";
import { fetchStock } from "@/lib/api";
import { formatMoney } from "@/lib/currency";

export default function RegionPage() {
  const { query } = useRouter();
  const region = (query.region || "").toString();
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const onLookup = async (e) => {
    e.preventDefault();
    if (!symbol) return;
    setLoading(true);
    try { setData(await fetchStock(region, symbol)); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold capitalize">{region} market</h1>
      <form onSubmit={onLookup} className="card flex gap-3 items-end">
        <div>
          <label className="text-sm opacity-70 block mb-1">Symbol</label>
          <input value={symbol} onChange={e=>setSymbol(e.target.value)}
                 className="rounded-lg bg-slate-800 px-3 py-2 w-48" placeholder="AAPL / INFY" />
        </div>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Fetching..." : "Get Quote"}
        </button>
      </form>

      {data && (
        <div className="card">
          <div className="text-lg font-semibold">{data.symbol} — {data.name}</div>
          <div className="opacity-70 text-sm">{data.exchange} • {data.country} • {data.currency}</div>
          <div className="mt-3 text-2xl">{formatMoney(data.currentPrice, data.currency)}</div>
        </div>
      )}
    </div>
  );
}
