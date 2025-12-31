// useGroups Hook - Custom hook for groups management
import { useEffect } from 'react';
import { useGroupsStore } from '../store/groupsStore';
import { useAuth } from './useAuth';

/**
 * Custom hook to manage groups state
 */
export const useGroups = () => {
  const { user } = useAuth();
  const {
    groups,
    selectedGroup,
    loading,
    error,
    fetchGroups,
    fetchGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    addMember,
    removeMember,
    clearError,
  } = useGroupsStore();

  // Auto-fetch groups when user is available
  useEffect(() => {
    if (user?.uid) {
      fetchGroups(user.uid);
    }
  }, [user]);

  return {
    groups,
    selectedGroup,
    loading,
    error,
    fetchGroups: () => user?.uid ? fetchGroups(user.uid) : Promise.reject('No user'),
    fetchGroup: (groupId: string) =>
      user?.uid ? fetchGroup(user.uid, groupId) : Promise.reject('No user'),
    createGroup: (input: any) =>
      user?.uid ? createGroup(user.uid, input) : Promise.reject('No user'),
    updateGroup: (groupId: string, updates: any) =>
      user?.uid ? updateGroup(user.uid, groupId, updates) : Promise.reject('No user'),
    deleteGroup: (groupId: string) =>
      user?.uid ? deleteGroup(user.uid, groupId) : Promise.reject('No user'),
    addMember: (groupId: string, personId: string) =>
      user?.uid ? addMember(user.uid, groupId, personId) : Promise.reject('No user'),
    removeMember: (groupId: string, personId: string) =>
      user?.uid ? removeMember(user.uid, groupId, personId) : Promise.reject('No user'),
    clearError,
  };
};
