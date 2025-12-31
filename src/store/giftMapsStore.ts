// Gift Maps Store - Zustand State Management for Gift Maps
import { create } from 'zustand';
import { GiftMap, SharedGiftMap, CreateGiftMapItemInput, GiftMapItem } from '../types/giftMap';
import { giftMapRepository } from '../repositories/giftMap.repository';

interface GiftMapsState {
  giftMaps: Record<string, GiftMap>;
  sharedGiftMap: SharedGiftMap | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchGiftMap: (userId: string, personId: string) => Promise<void>;
  createGiftMap: (userId: string, personId: string, personName: string) => Promise<void>;
  addItem: (userId: string, personId: string, item: CreateGiftMapItemInput) => Promise<void>;
  updateItem: (userId: string, personId: string, itemId: string, updates: Partial<GiftMapItem>) => Promise<void>;
  deleteItem: (userId: string, personId: string, itemId: string) => Promise<void>;
  generateShareLink: (userId: string, personId: string) => Promise<string>;
  disableSharing: (userId: string, personId: string) => Promise<void>;
  fetchSharedGiftMap: (shareToken: string) => Promise<void>;
  reserveItem: (shareToken: string, itemId: string) => Promise<void>;
  unreserveItem: (shareToken: string, itemId: string) => Promise<void>;
  clearError: () => void;
}

export const useGiftMapsStore = create<GiftMapsState>((set, get) => ({
  giftMaps: {},
  sharedGiftMap: null,
  loading: false,
  error: null,

  fetchGiftMap: async (userId: string, personId: string) => {
    set({ loading: true, error: null });
    try {
      let giftMap = await giftMapRepository.getGiftMap(userId, personId);

      // If gift map doesn't exist, create it
      if (!giftMap) {
        // We need the person name - this should be passed in
        // For now, we'll just create with person ID
        await giftMapRepository.createGiftMap(userId, personId, 'Person');
        giftMap = await giftMapRepository.getGiftMap(userId, personId);
      }

      if (giftMap) {
        set((state) => ({
          giftMaps: { ...state.giftMaps, [personId]: giftMap! },
          loading: false,
        }));
      } else {
        set({ loading: false });
      }
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch gift map' });
      throw error;
    }
  },

  createGiftMap: async (userId: string, personId: string, personName: string) => {
    set({ loading: true, error: null });
    try {
      await giftMapRepository.createGiftMap(userId, personId, personName);
      await get().fetchGiftMap(userId, personId);
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to create gift map' });
      throw error;
    }
  },

  addItem: async (userId: string, personId: string, item: CreateGiftMapItemInput) => {
    set({ loading: true, error: null });
    try {
      await giftMapRepository.addItem(userId, personId, item);
      await get().fetchGiftMap(userId, personId);
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to add item' });
      throw error;
    }
  },

  updateItem: async (userId: string, personId: string, itemId: string, updates: Partial<GiftMapItem>) => {
    set({ loading: true, error: null });
    try {
      await giftMapRepository.updateItem(userId, personId, itemId, updates);
      await get().fetchGiftMap(userId, personId);
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update item' });
      throw error;
    }
  },

  deleteItem: async (userId: string, personId: string, itemId: string) => {
    set({ loading: true, error: null });
    try {
      await giftMapRepository.deleteItem(userId, personId, itemId);
      await get().fetchGiftMap(userId, personId);
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to delete item' });
      throw error;
    }
  },

  generateShareLink: async (userId: string, personId: string) => {
    set({ loading: true, error: null });
    try {
      const shareToken = await giftMapRepository.generateShareLink(userId, personId);
      await get().fetchGiftMap(userId, personId);
      set({ loading: false });
      return shareToken;
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to generate share link' });
      throw error;
    }
  },

  disableSharing: async (userId: string, personId: string) => {
    set({ loading: true, error: null });
    try {
      await giftMapRepository.disableSharing(userId, personId);
      await get().fetchGiftMap(userId, personId);
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to disable sharing' });
      throw error;
    }
  },

  fetchSharedGiftMap: async (shareToken: string) => {
    set({ loading: true, error: null, sharedGiftMap: null });
    try {
      const sharedGiftMap = await giftMapRepository.getSharedGiftMap(shareToken);
      set({ sharedGiftMap, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch shared gift map' });
      throw error;
    }
  },

  reserveItem: async (shareToken: string, itemId: string) => {
    set({ loading: true, error: null });
    try {
      await giftMapRepository.reserveItem(shareToken, itemId);
      await get().fetchSharedGiftMap(shareToken);
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to reserve item' });
      throw error;
    }
  },

  unreserveItem: async (shareToken: string, itemId: string) => {
    set({ loading: true, error: null });
    try {
      await giftMapRepository.unreserveItem(shareToken, itemId);
      await get().fetchSharedGiftMap(shareToken);
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to unreserve item' });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
