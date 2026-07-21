import { create } from "zustand";
import api from "../api/axios";

export const useSearchStore = create((set) => ({
  results: { contacts: [], campaigns: [], templates: [] },
  isLoading: false,
  error: null,

  search: async (query) => {
    if (!query) {
      set({
        results: { contacts: [], campaigns: [], templates: [] },
        isLoading: false,
        error: null,
      });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
      set({ results: response.data.results, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearSearch: () => {
    set({
      results: { contacts: [], campaigns: [], templates: [] },
      isLoading: false,
      error: null,
    });
  },
}));
