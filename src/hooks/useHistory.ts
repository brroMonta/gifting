// useHistory Hook - Custom hook for gift history management
import { useEffect } from 'react';
import { useHistoryStore } from '../store/historyStore';
import { useAuth } from './useAuth';

/**
 * Custom hook to manage gift history state
 */
export const useHistory = () => {
  const { user } = useAuth();
  const {
    history,
    selectedHistory,
    loading,
    error,
    fetchHistory,
    fetchHistoryByPerson,
    fetchHistoryEntry,
    fetchGiftsGiven,
    fetchGiftsReceived,
    createHistoryEntry,
    updateHistoryEntry,
    deleteHistoryEntry,
    clearError,
  } = useHistoryStore();

  // Auto-fetch history when user is available
  useEffect(() => {
    if (user?.uid) {
      fetchHistory(user.uid);
    }
  }, [user]);

  return {
    history,
    selectedHistory,
    loading,
    error,
    fetchHistory: () => user?.uid ? fetchHistory(user.uid) : Promise.reject('No user'),
    fetchHistoryByPerson: (personId: string) =>
      user?.uid ? fetchHistoryByPerson(user.uid, personId) : Promise.reject('No user'),
    fetchHistoryEntry: (historyId: string) =>
      user?.uid ? fetchHistoryEntry(user.uid, historyId) : Promise.reject('No user'),
    fetchGiftsGiven: () =>
      user?.uid ? fetchGiftsGiven(user.uid) : Promise.reject('No user'),
    fetchGiftsReceived: () =>
      user?.uid ? fetchGiftsReceived(user.uid) : Promise.reject('No user'),
    createHistoryEntry: (input: any) =>
      user?.uid ? createHistoryEntry(user.uid, input) : Promise.reject('No user'),
    updateHistoryEntry: (historyId: string, updates: any) =>
      user?.uid ? updateHistoryEntry(user.uid, historyId, updates) : Promise.reject('No user'),
    deleteHistoryEntry: (historyId: string) =>
      user?.uid ? deleteHistoryEntry(user.uid, historyId) : Promise.reject('No user'),
    clearError,
  };
};
