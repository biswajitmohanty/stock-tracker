import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api",
  timeout: 15000,
});

export const fetchStock = async (region, symbol) => {
  const { data } = await api.get(`/stocks/${encodeURIComponent(region)}/${encodeURIComponent(symbol)}`);
  return data;
};

export const fetchPortfolio = async (type = "actual") => {
  const { data } = await api.get(`/portfolios/${type}`);
  return data;
};

export const addPosition = async (portfolioType, payload) => {
  const { data } = await api.post(`/portfolios/${portfolioType}/positions`, payload);
  return data;
};

export const removePosition = async (portfolioType, payload) => {
  const { data } = await api.delete(`/portfolios/${portfolioType}/positions`, { data: payload });
  return data;
};

export const sellPosition = async (payload) => {
  const { data } = await api.post("/portfolios/sell", payload);
  return data;
};

export const moveToHypothetical = async (payload) => {
  const { data } = await api.post("/portfolios/move-to-hypothetical", payload);
  return data;
};

export const fetchRegions = async () => {
  const { data } = await api.get("/markets/regions");
  return data;
};

export const fetchTradeHistory = async () => {
  const { data } = await api.get("/portfolios/history");
  return data;
};

export default api;
