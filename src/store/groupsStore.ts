// Groups Store - Zustand State Management for Groups
import { create } from 'zustand';
import { Group, CreateGroupInput } from '../types/group';
import { groupRepository } from '../repositories/group.repository';

interface GroupsState {
  groups: Group[];
  selectedGroup: Group | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchGroups: (userId: string) => Promise<void>;
  fetchGroup: (userId: string, groupId: string) => Promise<void>;
  createGroup: (userId: string, input: CreateGroupInput) => Promise<void>;
  updateGroup: (userId: string, groupId: string, updates: Partial<CreateGroupInput>) => Promise<void>;
  deleteGroup: (userId: string, groupId: string) => Promise<void>;
  addMember: (userId: string, groupId: string, personId: string) => Promise<void>;
  removeMember: (userId: string, groupId: string, personId: string) => Promise<void>;
  clearError: () => void;
}

export const useGroupsStore = create<GroupsState>((set, get) => ({
  groups: [],
  selectedGroup: null,
  loading: false,
  error: null,

  fetchGroups: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const groups = await groupRepository.getAllGroups(userId);
      set({ groups, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch groups' });
      throw error;
    }
  },

  fetchGroup: async (userId: string, groupId: string) => {
    set({ loading: true, error: null });
    try {
      const selectedGroup = await groupRepository.getGroup(userId, groupId);
      set({ selectedGroup, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch group' });
      throw error;
    }
  },

  createGroup: async (userId: string, input: CreateGroupInput) => {
    set({ loading: true, error: null });
    try {
      await groupRepository.createGroup(userId, input);
      await get().fetchGroups(userId);
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to create group' });
      throw error;
    }
  },

  updateGroup: async (userId: string, groupId: string, updates: Partial<CreateGroupInput>) => {
    set({ loading: true, error: null });
    try {
      await groupRepository.updateGroup(userId, groupId, updates);
      await get().fetchGroups(userId);
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update group' });
      throw error;
    }
  },

  deleteGroup: async (userId: string, groupId: string) => {
    set({ loading: true, error: null });
    try {
      await groupRepository.deleteGroup(userId, groupId);
      await get().fetchGroups(userId);
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to delete group' });
      throw error;
    }
  },

  addMember: async (userId: string, groupId: string, personId: string) => {
    set({ loading: true, error: null });
    try {
      await groupRepository.addMember(userId, groupId, personId);
      await get().fetchGroup(userId, groupId);
      await get().fetchGroups(userId);
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to add member' });
      throw error;
    }
  },

  removeMember: async (userId: string, groupId: string, personId: string) => {
    set({ loading: true, error: null });
    try {
      await groupRepository.removeMember(userId, groupId, personId);
      await get().fetchGroup(userId, groupId);
      await get().fetchGroups(userId);
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to remove member' });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
