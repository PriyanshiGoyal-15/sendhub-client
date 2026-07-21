import { create } from "zustand";
import api from "../api/axios";

export const useMessageLogStore = create((set) => ({
  recentLogs: [],
  isLoading: false,
  error: null,
  unreadCount: 0,

  fetchRecentLogs: async (limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/message-logs/recent?limit=${limit}`);
      const logs = response.data.logs;
      set({ 
        recentLogs: logs, 
        isLoading: false,
        // Mock unread count based on recent logs. 
        // A real app might have an "isRead" boolean on the log model.
        unreadCount: logs.length > 0 ? 3 : 0 
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearUnread: () => {
    set({ unreadCount: 0 });
  }
}));
