// Gift History Store - Zustand State Management for Gift History
import { create } from 'zustand';
import { GiftHistory, CreateGiftHistoryInput } from '../types/giftHistory';
import { giftHistoryRepository } from '../repositories/giftHistory.repository';

interface HistoryState {
  history: GiftHistory[];
  selectedHistory: GiftHistory | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchHistory: (userId: string) => Promise<void>;
  fetchHistoryByPerson: (userId: string, personId: string) => Promise<void>;
  fetchHistoryEntry: (userId: string, historyId: string) => Promise<void>;
  fetchGiftsGiven: (userId: string) => Promise<void>;
  fetchGiftsReceived: (userId: string) => Promise<void>;
  createHistoryEntry: (userId: string, input: CreateGiftHistoryInput) => Promise<void>;
  updateHistoryEntry: (userId: string, historyId: string, updates: Partial<CreateGiftHistoryInput>) => Promise<void>;
  deleteHistoryEntry: (userId: string, historyId: string) => Promise<void>;
  clearError: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: [],
  selectedHistory: null,
  loading: false,
  error: null,

  fetchHistory: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const history = await giftHistoryRepository.getAllHistory(userId);
      set({ history, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch history' });
      throw error;
    }
  },

  fetchHistoryByPerson: async (userId: string, personId: string) => {
    set({ loading: true, error: null });
    try {
      const history = await giftHistoryRepository.getHistoryByPerson(userId, personId);
      set({ history, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch history' });
      throw error;
    }
  },

  fetchHistoryEntry: async (userId: string, historyId: string) => {
    set({ loading: true, error: null });
    try {
      const selectedHistory = await giftHistoryRepository.getHistoryEntry(userId, historyId);
      set({ selectedHistory, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch history entry' });
      throw error;
    }
  },

  fetchGiftsGiven: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const history = await giftHistoryRepository.getGiftsGiven(userId);
      set({ history, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch gifts given' });
      throw error;
    }
  },

  fetchGiftsReceived: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const history = await giftHistoryRepository.getGiftsReceived(userId);
      set({ history, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch gifts received' });
      throw error;
    }
  },

  createHistoryEntry: async (userId: string, input: CreateGiftHistoryInput) => {
    set({ loading: true, error: null });
    try {
      await giftHistoryRepository.createHistoryEntry(userId, input);
      await get().fetchHistory(userId);
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to create history entry' });
      throw error;
    }
  },

  updateHistoryEntry: async (userId: string, historyId: string, updates: Partial<CreateGiftHistoryInput>) => {
    set({ loading: true, error: null });
    try {
      await giftHistoryRepository.updateHistoryEntry(userId, historyId, updates);
      await get().fetchHistory(userId);
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update history entry' });
      throw error;
    }
  },

  deleteHistoryEntry: async (userId: string, historyId: string) => {
    set({ loading: true, error: null });
    try {
      await giftHistoryRepository.deleteHistoryEntry(userId, historyId);
      await get().fetchHistory(userId);
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to delete history entry' });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
