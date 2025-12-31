// Root Layout - App Entry Point
import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from '../src/hooks/useAuth';
import { Loading } from '../src/components/ui/Loading';
import { notificationsService } from '../src/services/notifications.service';

export default function RootLayout() {
  const { isAuthenticated, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Request notification permissions when authenticated
  useEffect(() => {
    if (isAuthenticated && initialized) {
      // Request permissions in the background (don't block app)
      notificationsService.requestPermissions().catch((error) => {
        console.error('Failed to request notification permissions:', error);
      });
    }
  }, [isAuthenticated, initialized]);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = (segments[0] as string) === 'auth';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/auth/login' as any);
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if authenticated and trying to access auth screens
      router.replace('/' as any);
    }
  }, [isAuthenticated, initialized, segments]);

  // Show loading while checking auth state
  if (!initialized) {
    return (
      <SafeAreaProvider>
        <Loading message="Loading..." />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}
