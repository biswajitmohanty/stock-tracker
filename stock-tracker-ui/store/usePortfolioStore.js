import { create } from "zustand";
import { fetchPortfolio, moveToHypothetical } from "@/lib/api";

const usePortfolioStore = create((set, get) => ({
  loading: false,
  error: null,
  actual: { positions: [], totalValue: 0 },
  hypothetical: { positions: [], totalValue: 0 },

  load: async () => {
    try {
      set({ loading: true, error: null });
      const [actual, hypothetical] = await Promise.all([fetchPortfolio("actual"), fetchPortfolio("hypothetical")]);
      set({ actual, hypothetical, loading: false });
    } catch (e) {
      set({ error: e?.message || "Failed to load portfolio", loading: false });
    }
  },

  move: async (payload) => {
    await moveToHypothetical(payload);
    await get().load();
  }
}));

export default usePortfolioStore;
