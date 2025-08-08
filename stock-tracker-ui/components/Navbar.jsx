import Link from "next/link";
export default function Navbar() {
  return (
    <nav className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/75 backdrop-blur">
      <div className="mx-auto max-w-6xl flex items-center gap-6 px-4 py-3">
        <Link href="/" className="font-semibold text-lg">StockTracker</Link>
        <div className="flex gap-4 text-sm">
          <Link className="link" href="/markets">Markets</Link>
          <Link className="link" href="/portfolios/actual">Actual</Link>
          <Link className="link" href="/portfolios/hypothetical">Hypothetical</Link>
        </div>
      </div>
    </nav>
  );
}
