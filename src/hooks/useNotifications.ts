// useNotifications Hook - Custom hook for notifications management
import { useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { notificationsService } from '../services/notifications.service';
import { GiftEvent } from '../types/giftEvent';

/**
 * Custom hook to manage notifications
 */
export const useNotifications = () => {
  const router = useRouter();

  // Handle notification tap
  useEffect(() => {
    const subscription = notificationsService.addNotificationResponseListener((response) => {
      const data = response.notification.request.content.data;

      // Navigate to events tab when notification is tapped
      if (data?.eventId) {
        router.push('/(tabs)/events' as any);
      }
    });

    return () => subscription.remove();
  }, [router]);

  const requestPermissions = useCallback(async () => {
    return await notificationsService.requestPermissions();
  }, []);

  const scheduleEventReminders = useCallback(async (event: GiftEvent) => {
    try {
      return await notificationsService.scheduleEventReminders(event);
    } catch (error) {
      console.error('Failed to schedule reminders:', error);
      throw error;
    }
  }, []);

  const cancelEventReminders = useCallback(async (eventId: string) => {
    try {
      await notificationsService.cancelEventReminders(eventId);
    } catch (error) {
      console.error('Failed to cancel reminders:', error);
      throw error;
    }
  }, []);

  const rescheduleEventReminders = useCallback(async (event: GiftEvent) => {
    try {
      return await notificationsService.rescheduleEventReminders(event);
    } catch (error) {
      console.error('Failed to reschedule reminders:', error);
      throw error;
    }
  }, []);

  const getAllScheduledNotifications = useCallback(async () => {
    return await notificationsService.getAllScheduledNotifications();
  }, []);

  return {
    requestPermissions,
    scheduleEventReminders,
    cancelEventReminders,
    rescheduleEventReminders,
    getAllScheduledNotifications,
  };
};
