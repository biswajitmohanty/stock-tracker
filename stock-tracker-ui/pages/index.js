import usePortfolioStore from "@/store/usePortfolioStore";
import { useEffect } from "react";
import StatCard from "@/components/StatCard";
import Link from "next/link";

export default function Home() {
  const { load, actual, hypothetical, loading } = usePortfolioStore();
  useEffect(() => { load(); }, [load]);
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Actual Value" value={`$${(actual.totalValue||0).toLocaleString()}`} sub="Live portfolio" />
        <StatCard label="Hypothetical Value" value={`$${(hypothetical.totalValue||0).toLocaleString()}`} sub="If you hadn't sold" />
        <StatCard label="Positions" value={(actual.positions?.length||0) + (hypothetical.positions?.length||0)} />
      </div>
      <div className="card flex flex-wrap items-center gap-3">
        <Link href="/markets" className="btn">Browse Markets</Link>
        <Link href="/portfolios/actual" className="btn">View Actual</Link>
        <Link href="/portfolios/hypothetical" className="btn">View Hypothetical</Link>
        {loading ? <span className="opacity-70 text-sm">Loading...</span> : null}
      </div>
    </div>
  );
}
