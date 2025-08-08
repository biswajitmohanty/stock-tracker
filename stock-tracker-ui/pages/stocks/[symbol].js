import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchStock } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatMoney } from "@/lib/currency";

export default function StockDetail() {
  const { query } = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!query.symbol || !query.region) return;
    fetchStock(query.region, query.symbol).then(setData);
  }, [query.symbol, query.region]);

  return (
    <div className="space-y-4">
      {data ? (
        <>
          <div className="card">
            <div className="text-xl font-semibold">{data.symbol} — {data.name}</div>
            <div className="opacity-70 text-sm">{data.exchange} • {data.country} • {data.currency}</div>
            <div className="mt-3 text-2xl">{formatMoney(data.currentPrice, data.currency)}</div>
          </div>
          <div className="card h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[{t:"T-4", p: 90},{t:"T-3", p: 95},{t:"T-2", p: 100},{t:"T-1", p: 110},{t:"T", p: data.currentPrice}]}>
                <XAxis dataKey="t" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="p" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : <div className="opacity-70">Loading… (pass ?region=us to URL)</div>}
    </div>
  );
}
