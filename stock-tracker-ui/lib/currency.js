export const formatMoney = (value, currency = process.env.NEXT_PUBLIC_DEFAULT_CCY || "USD") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value ?? 0);
