import { create } from "zustand";
import api from "../api/axios";

export const useSettingStore = create((set, get) => ({
  settings: null,
  isLoading: false,
  error: null,

  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/settings");
      set({ settings: response.data.settings, isLoading: false });
      return { success: true, settings: response.data.settings };
    } catch (error) {
      if (error.response?.status === 404) {
        set({ settings: null, isLoading: false });
        return { success: true, settings: null };
      }
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  createSettings: async (settingsData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/settings", settingsData);
      set({ settings: response.data.settings, isLoading: false });
      return { success: true, settings: response.data.settings };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  updateSettings: async (settingsData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put("/settings", settingsData);
      set({ settings: response.data.settings, isLoading: false });
      return { success: true, settings: response.data.settings };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  saveSettings: async (settingsData) => {
    const { settings, createSettings, updateSettings } = get();
    if (settings) {
      return await updateSettings(settingsData);
    } else {
      return await createSettings(settingsData);
    }
  },
}));
