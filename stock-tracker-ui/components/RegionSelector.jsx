import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchRegions } from "@/lib/api";

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
      } catch (e) {
        setErr("Couldn’t load regions from server.");
        // Sensible fallback if API is down:
        setRegions([
          { id: "us", name: "United States" },
          { id: "india", name: "India" },
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="opacity-70">Loading regions…</div>;
  if (err)     return (
    <div className="space-y-3">
      <div className="text-amber-400 text-sm">{err} Showing defaults.</div>
      <RegionGrid regions={regions} />
    </div>
  );

  return <RegionGrid regions={regions} />;
}

function RegionGrid({ regions }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {regions.map(r => (
        <Link key={r.id} href={`/markets/${r.id}`} className="card hover:ring-2 ring-blue-600">
          <div className="text-xl font-semibold">{r.name}</div>
          <div className="opacity-70 text-sm mt-1">Browse stocks & fetch quotes</div>
        </Link>
      ))}
    </div>
  );
}
