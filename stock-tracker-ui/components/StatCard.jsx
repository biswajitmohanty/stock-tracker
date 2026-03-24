export default function StatCard({ label, value, sub, up }) {
  const valueColor =
    up === undefined ? "text-slate-100" : up ? "text-emerald-400" : "text-red-400";
  return (
    <div className="card">
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold tabular-nums ${valueColor}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}
