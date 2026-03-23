import { create } from "zustand";
import {
  fetchPortfolio,
  addPosition as apiAddPosition,
  removePosition as apiRemovePosition,
  sellPosition as apiSellPosition,
  moveToHypothetical as apiMove,
  fetchTradeHistory,
} from "@/lib/api";

const usePortfolioStore = create((set, get) => ({
  loading: false,
  error: null,
  actual: { positions: [], totalValue: 0, totalCost: 0, totalPl: 0, totalPlPercent: 0 },
  hypothetical: { positions: [], totalValue: 0, totalCost: 0, totalPl: 0, totalPlPercent: 0 },
  history: [],
  historyLoading: false,

  load: async () => {
    try {
      set({ loading: true, error: null });
      const [actual, hypothetical] = await Promise.all([
        fetchPortfolio("actual"),
        fetchPortfolio("hypothetical"),
      ]);
      set({ actual, hypothetical, loading: false });
    } catch (e) {
      set({ error: e?.message || "Failed to load portfolio", loading: false });
    }
  },

  addPosition: async (portfolioType, payload) => {
    await apiAddPosition(portfolioType, payload);
    await get().load();
  },

  removePosition: async (portfolioType, payload) => {
    await apiRemovePosition(portfolioType, payload);
    await get().load();
  },

  sell: async (payload) => {
    await apiSellPosition(payload);
    await get().load();
  },

  move: async (payload) => {
    await apiMove(payload);
    await get().load();
  },

  loadHistory: async () => {
    try {
      set({ historyLoading: true });
      const history = await fetchTradeHistory();
      set({ history, historyLoading: false });
    } catch (e) {
      set({ historyLoading: false });
    }
  },
}));

export default usePortfolioStore;
