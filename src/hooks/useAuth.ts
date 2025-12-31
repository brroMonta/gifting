// useAuth Hook - Custom hook for authentication
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { onAuthStateChange } from '../services/auth.service';

/**
 * Custom hook to manage authentication state
 * Sets up auth state listener and provides auth methods
 */
export const useAuth = () => {
  const {
    user,
    loading,
    error,
    initialized,
    signUp,
    signIn,
    signOut,
    setUser,
    setInitialized,
  } = useAuthStore();

  // Set up auth state listener on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      if (!initialized) {
        setInitialized(true);
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [initialized, setUser, setInitialized]);

  return {
    user,
    loading,
    error,
    initialized,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
  };
};
