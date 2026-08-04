import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/axios";

export const useTemplateStore = create(
  persist(
    (set, get) => ({
      templates: [],
      loading: false,
      error: null,

      currentPage: 1,
      rowsPerPage: 10,
      totalPages: 1,
      totalTemplates: 0,
      searchQuery: "",
      activeCategory: "All",

      setSearchQuery: (query) => {
        set({ searchQuery: query, currentPage: 1 });
        get().fetchTemplates();
      },

      setActiveCategory: (category) => {
        set({ activeCategory: category, currentPage: 1 });
        get().fetchTemplates();
      },

      setCurrentPage: (page) => {
        set({ currentPage: page });
        get().fetchTemplates();
      },

      fetchTemplates: async () => {
        set({ loading: true, error: null });
        try {
          const { currentPage, rowsPerPage, searchQuery, activeCategory } =
            get();
          const params = new URLSearchParams({
            page: currentPage,
            limit: rowsPerPage,
          });

          if (searchQuery) params.append("search", searchQuery);
          if (activeCategory && activeCategory !== "All") {
            params.append("category", activeCategory);
          }

          const res = await api.get(`/templates?${params.toString()}`);

          set({
            templates: res.data.templates,
            totalPages: res.data.totalPages || 1,
            totalTemplates: res.data.total || 0,
            loading: false,
          });
        } catch (err) {
          set({
            error: err.response?.data?.message || "Failed to fetch templates",
            loading: false,
          });
        }
      },

      createTemplate: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post("/templates", data);
          await get().fetchTemplates();
          return res.data;
        } catch (err) {
          const errorMessage = err.response?.data?.message || "Failed to create template";
          set({
            error: errorMessage,
            loading: false,
          });
          throw new Error(errorMessage);
        }
      },

      updateTemplate: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const res = await api.put(`/templates/${id}`, data);
          await get().fetchTemplates();
          return res.data;
        } catch (err) {
          const errorMessage = err.response?.data?.message || "Failed to update template";
          set({
            error: errorMessage,
            loading: false,
          });
          throw new Error(errorMessage);
        }
      },

      deleteTemplate: async (id) => {
        set({ loading: true, error: null });
        try {
          await api.delete(`/templates/${id}`);
          await get().fetchTemplates();
        } catch (err) {
          const errorMessage = err.response?.data?.message || "Failed to delete template";
          set({
            error: errorMessage,
            loading: false,
          });
          throw new Error(errorMessage);
        }
      },

      getTemplate: async (id) => {
        try {
          const res = await api.get(`/templates/${id}`);
          return res.data.template;
        } catch (err) {
          console.error("Failed to fetch template", err);
          throw err;
        }
      },
    }),
    {
      name: "template-store",
    },
  ),
);
