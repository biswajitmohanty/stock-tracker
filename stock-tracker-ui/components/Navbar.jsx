import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const { pathname } = useRouter();

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/markets", label: "Markets" },
    { href: "/portfolios/actual", label: "Portfolio" },
    { href: "/portfolios/hypothetical", label: "What-If" },
    { href: "/history", label: "History" },
  ];

  return (
    <nav className="sticky top-0 z-20 border-b border-[#1e2d45] bg-[#050b14]/90 backdrop-blur">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-sky-400 font-bold text-base tracking-tight">
            <span className="text-white">◈</span> StockTracker
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {links.map(({ href, label }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sky-900/40 text-sky-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live
        </div>
      </div>
    </nav>
  );
}
