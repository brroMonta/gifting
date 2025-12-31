// People Store - Zustand State Management for People
import { create } from 'zustand';
import { Person, CreatePersonInput, UpdatePersonInput } from '../types/person';
import { personRepository } from '../repositories/person.repository';

interface PeopleState {
  people: Person[];
  loading: boolean;
  error: string | null;
  selectedPerson: Person | null;

  // Actions
  fetchPeople: (userId: string) => Promise<void>;
  fetchPerson: (userId: string, personId: string) => Promise<void>;
  createPerson: (userId: string, data: CreatePersonInput) => Promise<string>;
  updatePerson: (userId: string, data: UpdatePersonInput) => Promise<void>;
  deletePerson: (userId: string, personId: string) => Promise<void>;
  searchPeople: (userId: string, searchTerm: string) => Promise<void>;
  setSelectedPerson: (person: Person | null) => void;
  clearError: () => void;
}

export const usePeopleStore = create<PeopleState>((set, get) => ({
  people: [],
  loading: false,
  error: null,
  selectedPerson: null,

  fetchPeople: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const people = await personRepository.getAllPeople(userId);
      set({ people, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch people' });
      throw error;
    }
  },

  fetchPerson: async (userId: string, personId: string) => {
    set({ loading: true, error: null });
    try {
      const person = await personRepository.getPerson(userId, personId);
      set({ selectedPerson: person, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch person' });
      throw error;
    }
  },

  createPerson: async (userId: string, data: CreatePersonInput) => {
    set({ loading: true, error: null });
    try {
      const personId = await personRepository.createPerson(userId, data);

      // Refetch people to update the list
      await get().fetchPeople(userId);

      set({ loading: false });
      return personId;
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to create person' });
      throw error;
    }
  },

  updatePerson: async (userId: string, data: UpdatePersonInput) => {
    set({ loading: true, error: null });
    try {
      await personRepository.updatePerson(userId, data);

      // Update the person in the local state
      const people = get().people.map((p) =>
        p.id === data.id ? { ...p, ...data } : p
      );

      set({ people, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update person' });
      throw error;
    }
  },

  deletePerson: async (userId: string, personId: string) => {
    set({ loading: true, error: null });
    try {
      await personRepository.deletePerson(userId, personId);

      // Remove the person from local state
      const people = get().people.filter((p) => p.id !== personId);

      set({ people, loading: false, selectedPerson: null });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to delete person' });
      throw error;
    }
  },

  searchPeople: async (userId: string, searchTerm: string) => {
    set({ loading: true, error: null });
    try {
      const people = await personRepository.searchPeople(userId, searchTerm);
      set({ people, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to search people' });
      throw error;
    }
  },

  setSelectedPerson: (person: Person | null) => {
    set({ selectedPerson: person });
  },

  clearError: () => {
    set({ error: null });
  },
}));
