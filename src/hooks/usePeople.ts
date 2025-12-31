// usePeople Hook - Custom hook for people management
import { useEffect } from 'react';
import { usePeopleStore } from '../store/peopleStore';
import { useAuth } from './useAuth';

/**
 * Custom hook to manage people state
 * Automatically fetches people when user is authenticated
 */
export const usePeople = () => {
  const { user } = useAuth();
  const {
    people,
    loading,
    error,
    selectedPerson,
    fetchPeople,
    fetchPerson,
    createPerson,
    updatePerson,
    deletePerson,
    searchPeople,
    setSelectedPerson,
    clearError,
  } = usePeopleStore();

  // Fetch people when user is authenticated
  useEffect(() => {
    if (user?.uid) {
      fetchPeople(user.uid);
    }
  }, [user?.uid]);

  return {
    people,
    loading,
    error,
    selectedPerson,
    fetchPeople: () => user?.uid && fetchPeople(user.uid),
    fetchPerson: (personId: string) => user?.uid && fetchPerson(user.uid, personId),
    createPerson: (data: any) => user?.uid ? createPerson(user.uid, data) : Promise.reject('No user'),
    updatePerson: (data: any) => user?.uid ? updatePerson(user.uid, data) : Promise.reject('No user'),
    deletePerson: (personId: string) => user?.uid ? deletePerson(user.uid, personId) : Promise.reject('No user'),
    searchPeople: (searchTerm: string) => user?.uid && searchPeople(user.uid, searchTerm),
    setSelectedPerson,
    clearError,
  };
};
