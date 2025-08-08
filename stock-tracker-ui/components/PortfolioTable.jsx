import { formatMoney } from "@/lib/currency";
import StockRow from "./StockRow";

export default function PortfolioTable({ title, portfolio, onMove }) {
  const rows = portfolio?.positions || [];
  return (
    <div className="card">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="text-sm opacity-80">
          Total Value: {formatMoney(portfolio?.totalValue || 0)}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left opacity-70">
            <tr>
              <th className="py-2">Symbol</th>
              <th>Exchange</th>
              <th>Qty</th>
              <th>Avg Price</th>
              <th>Current</th>
              <th>P/L</th>
              {onMove ? <th>Action</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td className="py-6 opacity-60" colSpan={7}>No positions yet.</td></tr>
            ) : rows.map(p => (
              <StockRow key={`${p.symbol}-${p.exchange}`} pos={p} onMove={onMove}/>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
