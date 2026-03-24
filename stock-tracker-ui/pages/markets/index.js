import RegionSelector from "@/components/RegionSelector";

export default function Markets() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Markets</h1>
        <p className="text-sm text-slate-500 mt-0.5">Select a market to look up real-time quotes</p>
      </div>
      <RegionSelector />
    </div>
  );
}
