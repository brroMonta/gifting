// Auth Store - Zustand State Management
import { create } from 'zustand';
import { User } from 'firebase/auth';
import * as authService from '../services/auth.service';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;

  // Actions
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,

  signUp: async (email: string, password: string, displayName: string) => {
    set({ loading: true, error: null });
    try {
      const user = await authService.signUp(email, password, displayName);
      set({ user, loading: false, error: null });
    } catch (error: any) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const user = await authService.signIn(email, password);
      set({ user, loading: false, error: null });
    } catch (error: any) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      await authService.signOut();
      set({ user: null, loading: false, error: null });
    } catch (error: any) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  setUser: (user: User | null) => {
    set({ user });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setInitialized: (initialized: boolean) => {
    set({ initialized });
  },
}));
