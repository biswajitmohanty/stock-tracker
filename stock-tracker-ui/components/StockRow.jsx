import { formatMoney } from "@/lib/currency";
export default function StockRow({ pos, onMove }) {
  const pl = (pos.currentPrice - pos.averagePrice) * pos.quantity;
  const plColor = pl >= 0 ? "text-green-400" : "text-red-400";
  return (
    <tr className="border-t border-slate-800">
      <td className="py-2 font-medium">{pos.symbol}</td>
      <td>{pos.exchange}</td>
      <td>{pos.quantity}</td>
      <td>{formatMoney(pos.averagePrice, pos.currency)}</td>
      <td>{formatMoney(pos.currentPrice, pos.currency)}</td>
      <td className={plColor}>{formatMoney(pl, pos.currency)}</td>
      {onMove ? (
        <td>
          <button className="btn" onClick={() => onMove({ symbol: pos.symbol, exchange: pos.exchange })}>
            Move → Hypo
          </button>
        </td>
      ) : null}
    </tr>
  );
}
