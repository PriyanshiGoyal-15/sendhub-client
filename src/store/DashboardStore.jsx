import { create } from "zustand";
import api from "../api/axios";

export const useDashboardStore = create((set, get) => ({
  dashboardData: null,
  dailyMessages: [],
  messageStatus: null,
  recentActivity: [],
  quickStats: null,
  
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    try {
      const response = await api.get("/dashboard");
      set({ dashboardData: response.data });
    } catch (error) {
      console.error(error);
    }
  },

  fetchDailyMessages: async () => {
    try {
      const response = await api.get("/dashboard/daily-messages");
      set({ dailyMessages: response.data.data });
    } catch (error) {
      console.error(error);
    }
  },

  fetchMessageStatus: async () => {
    try {
      const response = await api.get("/dashboard/message-status");
      set({ messageStatus: response.data.status });
    } catch (error) {
      console.error(error);
    }
  },

  fetchRecentActivity: async () => {
    try {
      const response = await api.get("/dashboard/recent-activity");
      set({ recentActivity: response.data.activities });
    } catch (error) {
      console.error(error);
    }
  },

  fetchQuickStats: async () => {
    try {
      const response = await api.get("/dashboard/quick-stats");
      set({ quickStats: response.data.quickStats });
    } catch (error) {
      console.error(error);
    }
  },

  fetchAll: async () => {
    const { fetchDashboardData, fetchDailyMessages, fetchMessageStatus, fetchRecentActivity, fetchQuickStats } = get();
    set({ isLoading: true, error: null });
    try {
      await Promise.all([
        fetchDashboardData(),
        fetchDailyMessages(),
        fetchMessageStatus(),
        fetchRecentActivity(),
        fetchQuickStats()
      ]);
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  }
}));
