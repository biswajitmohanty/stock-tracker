import Link from "next/link";
const REGIONS = [
  { id: "us", name: "United States" },
  { id: "india", name: "India" }
];
export default function RegionSelector() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {REGIONS.map(r => (
        <Link key={r.id} href={`/markets/${r.id}`} className="card hover:ring-2 ring-blue-600">
          <div className="text-xl font-semibold">{r.name}</div>
          <div className="opacity-70 text-sm mt-1">Browse stocks & fetch quotes</div>
        </Link>
      ))}
    </div>
  );
}
