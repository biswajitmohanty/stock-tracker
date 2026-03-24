export function formatMoney(amount, currency = "USD") {
  if (amount == null || isNaN(amount)) return "—";
  const cur = currency || "USD";
  const locale = cur === "INR" ? "en-IN" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: cur,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPct(value) {
  if (value == null || isNaN(value)) return "—";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${Number(value).toFixed(2)}%`;
}

export function formatNum(value, decimals = 2) {
  if (value == null || isNaN(value)) return "—";
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
