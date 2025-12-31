// useGiftMaps Hook - Custom hook for gift maps management
import { useEffect } from 'react';
import { useGiftMapsStore } from '../store/giftMapsStore';
import { useAuth } from './useAuth';

/**
 * Custom hook to manage gift maps state
 * Automatically fetches all gift maps when user is authenticated
 */
export const useGiftMaps = () => {
  const { user } = useAuth();
  const store = useGiftMapsStore();

  // Fetch all gift maps when user is authenticated
  useEffect(() => {
    if (user?.uid) {
      store.fetchAllGiftMaps(user.uid);
    }
  }, [user?.uid]);

  return {
    giftMaps: store.giftMaps,
    sharedGiftMap: store.sharedGiftMap,
    loading: store.loading,
    error: store.error,
    fetchAllGiftMaps: () => user?.uid && store.fetchAllGiftMaps(user.uid),
    fetchGiftMap: (personId: string) =>
      user?.uid ? store.fetchGiftMap(user.uid, personId) : Promise.reject('No user'),
    createGiftMap: (personId: string, personName: string) =>
      user?.uid ? store.createGiftMap(user.uid, personId, personName) : Promise.reject('No user'),
    addItem: (personId: string, item: any) =>
      user?.uid ? store.addItem(user.uid, personId, item) : Promise.reject('No user'),
    updateItem: (personId: string, itemId: string, updates: any) =>
      user?.uid ? store.updateItem(user.uid, personId, itemId, updates) : Promise.reject('No user'),
    deleteItem: (personId: string, itemId: string) =>
      user?.uid ? store.deleteItem(user.uid, personId, itemId) : Promise.reject('No user'),
    generateShareLink: (personId: string) =>
      user?.uid ? store.generateShareLink(user.uid, personId) : Promise.reject('No user'),
    disableSharing: (personId: string) =>
      user?.uid ? store.disableSharing(user.uid, personId) : Promise.reject('No user'),
    fetchSharedGiftMap: store.fetchSharedGiftMap,
    reserveItem: store.reserveItem,
    unreserveItem: store.unreserveItem,
    clearError: store.clearError,
  };
};
