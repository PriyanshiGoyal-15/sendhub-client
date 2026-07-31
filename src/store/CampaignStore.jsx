import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/axios";

export const useCampaignStore = create(
  persist(
    (set, get) => ({
      campaigns: [],
      filters: ["All", "Running", "Scheduled", "Draft", "Completed", "Failed"],
      loading: false,
      error: null,

      // Pagination & Search state
      currentPage: 1,
      rowsPerPage: 20,
      totalPages: 1,
      totalCampaigns: 0,
      searchQuery: "",

      activeStatus: "All",

      setSearchQuery: (query) => {
        set({ searchQuery: query, currentPage: 1 });
        get().fetchCampaigns();
      },

      setActiveStatus: (status) => {
        set({ activeStatus: status, currentPage: 1 });
        get().fetchCampaigns();
      },

      setCurrentPage: (page) => {
        set({ currentPage: page });
        get().fetchCampaigns();
      },

      fetchFilters: async () => {
        try {
          const res = await api.get("/campaigns/filters");
          if (res.data.status) {
            set({ filters: res.data.status });
          }
        } catch (err) {
          console.error("Failed to fetch campaign filters", err);
        }
      },

      fetchCampaigns: async () => {
        set({ loading: true, error: null });
        try {
          const { currentPage, rowsPerPage, searchQuery, activeStatus } = get();
          const params = new URLSearchParams({
            page: currentPage,
            limit: rowsPerPage,
          });

          if (searchQuery) params.append("search", searchQuery);
          if (activeStatus && activeStatus !== "All")
            params.append("status", activeStatus);

          const res = await api.get(`/campaigns?${params.toString()}`);

          set({
            campaigns: res.data.campaigns,
            totalPages: res.data.pagination?.pages || 1,
            totalCampaigns: res.data.pagination?.total || 0,
            loading: false,
          });
        } catch (err) {
          set({
            error: err.response?.data?.message || "Failed to fetch campaigns",
            loading: false,
          });
        }
      },

      createCampaign: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post("/campaigns", data);
          await get().fetchCampaigns();
          return res.data;
        } catch (err) {
          set({
            error: err.response?.data?.message || "Failed to create campaign",
            loading: false,
          });
          throw err;
        }
      },

      deleteCampaign: async (id) => {
        set({ loading: true, error: null });
        try {
          await api.delete(`/campaigns/${id}`);
          await get().fetchCampaigns();
        } catch (err) {
          set({
            loading: false,
          });
          throw err;
        }
      },

      getCampaign: async (id) => {
        try {
          const res = await api.get(`/campaigns/${id}`);
          return res.data.campaign;
        } catch (err) {
          console.error("Failed to fetch campaign", err);
          throw err;
        }
      },

      updateCampaign: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const res = await api.put(`/campaigns/${id}`, data);
          await get().fetchCampaigns();
          return res.data;
        } catch (err) {
          set({
            error: err.response?.data?.message || "Failed to update campaign",
            loading: false,
          });
          throw err;
        }
      },
    }),
    { name: "campaign-store" },
  ),
);
