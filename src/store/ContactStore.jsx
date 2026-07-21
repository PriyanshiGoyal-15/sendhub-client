import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/axios";

export const useContactStore = create(
  persist(
    (set, get) => ({
      contacts: [],
  filters: [],
  statuses: [],
  tags: [],
  loading: false,
  error: null,

  // Pagination & Search state
  currentPage: 1,
  rowsPerPage: 10,
  totalPages: 1,
  totalContacts: 0,
  searchQuery: "",
  activeStatus: "",
  activeTag: "",

  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 });
    get().fetchContacts();
  },

  setActiveStatus: (status) => {
    set({ activeStatus: status, currentPage: 1 });
    get().fetchContacts();
  },

  setActiveTag: (tag) => {
    set({ activeTag: tag, currentPage: 1 });
    get().fetchContacts();
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
    get().fetchContacts();
  },

  setRowsPerPage: (rows) => {
    set({ rowsPerPage: rows, currentPage: 1 });
    get().fetchContacts();
  },

  fetchFilters: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/contact/filters");
      set({
        filters: res.data.filters,
        statuses: res.data.statuses || [],
        tags: res.data.tags || [],
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch filters",
        loading: false,
      });
    }
  },

  fetchContacts: async () => {
    set({ loading: true, error: null });
    try {
      const { currentPage, rowsPerPage, searchQuery, activeStatus, activeTag } =
        get();
      const params = new URLSearchParams({
        page: currentPage,
        limit: rowsPerPage,
      });

      if (searchQuery) params.append("search", searchQuery);
      if (activeStatus) params.append("status", activeStatus);
      if (activeTag) params.append("tag", activeTag);

      const res = await api.get(`/contact?${params.toString()}`);
      const total = res.data.total || 0;
      const totalPages = Math.ceil(total / rowsPerPage) || 1;

      set({
        contacts: res.data.contacts,
        totalPages: totalPages,
        totalContacts: total,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch contacts",
        loading: false,
      });
    }
  },

  createContact: async (data) => {
    set({ loading: true, error: null });
    try {
      await api.post("/contact", data);
      await get().fetchContacts();
      await get().fetchFilters(); // Refresh filters in case a new tag was added
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to create contact",
        loading: false,
      });
      throw err;
    }
  },

  updateContact: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/contact/${id}`, data);
      set((state) => ({
        contacts: state.contacts.map((c) =>
          c._id === id || c.id === id ? res.data.contact : c,
        ),
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to update contact",
        loading: false,
      });
      throw err;
    }
  },

  deleteContact: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/contact/${id}`);
      set((state) => ({
        contacts: state.contacts.filter((c) => c._id !== id && c.id !== id),
        totalContacts: state.totalContacts - 1,
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to delete contact",
        loading: false,
      });
      throw err;
    }
  },

  // --- BULK ACTIONS ---
  selectedContacts: [],

  toggleSelectAll: () => {
    set((state) => {
      const allSelected =
        state.selectedContacts.length === state.contacts.length &&
        state.contacts.length > 0;
      return {
        selectedContacts: allSelected
          ? []
          : state.contacts.map((c) => c._id || c.id),
      };
    });
  },

  toggleSelectContact: (id) => {
    set((state) => {
      const isSelected = state.selectedContacts.includes(id);
      return {
        selectedContacts: isSelected
          ? state.selectedContacts.filter((contactId) => contactId !== id)
          : [...state.selectedContacts, id],
      };
    });
  },

  clearSelection: () => set({ selectedContacts: [] }),

  bulkDelete: async () => {
    const { selectedContacts, contacts } = get();
    set({ loading: true, error: null });
    try {
      // Execute all deletes in parallel
      await Promise.all(
        selectedContacts.map((id) => api.delete(`/contact/${id}`)),
      );

      set({
        contacts: contacts.filter(
          (c) => !selectedContacts.includes(c._id || c.id),
        ),
        selectedContacts: [],
        loading: false,
      });
      // Re-fetch to fix pagination if needed
      get().fetchContacts();
    } catch (err) {
      set({
        error: "Failed to delete some contacts",
        loading: false,
      });
      throw err;
    }
  },

  bulkAddTags: async (tagsToAdd) => {
    const { selectedContacts, contacts } = get();
    set({ loading: true, error: null });
    try {
      const updatedContactsData = await Promise.all(
        selectedContacts.map(async (id) => {
          const contact = contacts.find((c) => (c._id || c.id) === id);
          if (!contact) return null;

          const newTags = [...new Set([...(contact.tags || []), ...tagsToAdd])];
          const res = await api.put(`/contact/${id}`, { tags: newTags });
          return res.data.contact;
        }),
      );

      set((state) => {
        const updatedList = state.contacts.map((c) => {
          const updated = updatedContactsData.find(
            (uc) => uc && (uc._id === c._id || uc.id === c.id),
          );
          return updated ? updated : c;
        });
        return {
          contacts: updatedList,
          selectedContacts: [],
          loading: false,
        };
      });

      // Re-fetch filters to ensure new tags appear in global tag list
      get().fetchFilters();
    } catch (err) {
      set({
        error: "Failed to update some contacts",
        loading: false,
      });
      throw err;
    }
  },
}), { name: "contact-store" }));
