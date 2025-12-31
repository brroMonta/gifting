// useGiftMaps Hook - Custom hook for gift maps management
import { useGiftMapsStore } from '../store/giftMapsStore';
import { useAuth } from './useAuth';

/**
 * Custom hook to manage gift maps state
 */
export const useGiftMaps = () => {
  const { user } = useAuth();
  const {
    giftMaps,
    sharedGiftMap,
    loading,
    error,
    fetchGiftMap,
    createGiftMap,
    addItem,
    updateItem,
    deleteItem,
    generateShareLink,
    disableSharing,
    fetchSharedGiftMap,
    reserveItem,
    unreserveItem,
    clearError,
  } = useGiftMapsStore();

  return {
    giftMaps,
    sharedGiftMap,
    loading,
    error,
    fetchGiftMap: (personId: string) =>
      user?.uid ? fetchGiftMap(user.uid, personId) : Promise.reject('No user'),
    createGiftMap: (personId: string, personName: string) =>
      user?.uid ? createGiftMap(user.uid, personId, personName) : Promise.reject('No user'),
    addItem: (personId: string, item: any) =>
      user?.uid ? addItem(user.uid, personId, item) : Promise.reject('No user'),
    updateItem: (personId: string, itemId: string, updates: any) =>
      user?.uid ? updateItem(user.uid, personId, itemId, updates) : Promise.reject('No user'),
    deleteItem: (personId: string, itemId: string) =>
      user?.uid ? deleteItem(user.uid, personId, itemId) : Promise.reject('No user'),
    generateShareLink: (personId: string) =>
      user?.uid ? generateShareLink(user.uid, personId) : Promise.reject('No user'),
    disableSharing: (personId: string) =>
      user?.uid ? disableSharing(user.uid, personId) : Promise.reject('No user'),
    fetchSharedGiftMap,
    reserveItem,
    unreserveItem,
    clearError,
  };
};
