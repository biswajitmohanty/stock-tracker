import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchRegions } from "@/lib/api";

const REGION_META = {
  us: {
    flag: "🇺🇸",
    exchange: "NYSE / NASDAQ",
    currency: "USD",
    description: "US equities — Apple, Tesla, Amazon & more",
    color: "from-sky-900/30 to-blue-900/20",
    border: "border-sky-800/30",
  },
  india: {
    flag: "🇮🇳",
    exchange: "NSE / BSE",
    currency: "INR",
    description: "Indian equities — Infosys, Reliance, TCS & more",
    color: "from-orange-900/30 to-amber-900/20",
    border: "border-orange-800/30",
  },
};

export default function RegionSelector() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await fetchRegions();
        setRegions(Array.isArray(list) ? list : []);
      } catch {
        setErr("Couldn't reach server — showing defaults.");
        setRegions([{ id: "us", name: "United States" }, { id: "india", name: "India" }]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="card-sm h-32 animate-pulse bg-slate-800/40" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {err && (
        <div className="text-amber-400 text-sm bg-amber-900/20 border border-amber-800/30 rounded-lg px-3 py-2">
          {err}
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        {regions.map((r) => {
          const meta = REGION_META[r.id] || {};
          return (
            <Link
              key={r.id}
              href={`/markets/${r.id}`}
              className={`card bg-gradient-to-br ${meta.color || "from-slate-900/60"} border ${meta.border || "border-[#1e2d45]"} hover:brightness-110 transition-all`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl mb-2">{meta.flag || "🌐"}</div>
                  <div className="text-lg font-bold text-slate-100">{r.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{meta.exchange || ""}</div>
                  <div className="text-sm text-slate-400 mt-2">{meta.description || "Browse stocks & quotes"}</div>
                </div>
                <span className="badge bg-slate-800/50 text-slate-400 border border-slate-700/30 text-xs">
                  {meta.currency || ""}
                </span>
              </div>
              <div className="mt-4 text-xs text-sky-400 font-medium flex items-center gap-1">
                Search quotes →
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
