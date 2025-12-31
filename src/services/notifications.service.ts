// Notifications Service - Expo Notifications
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { GiftEvent } from '../types/giftEvent';
import { REMINDER_INTERVALS, REMINDER_HOUR, REMINDER_MINUTE } from '../utils/constants';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationsService {
  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return false;
      }

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Gift Reminders',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6366f1',
        });
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Schedule reminders for an event (30, 7, and 1 day before)
   */
  async scheduleEventReminders(event: GiftEvent): Promise<string[]> {
    if (!event.remindersEnabled) {
      return [];
    }

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Notification permissions not granted');
    }

    const notificationIds: string[] = [];
    const eventDate = new Date(event.eventDate);

    for (const days of REMINDER_INTERVALS) {
      const reminderDate = new Date(eventDate);
      reminderDate.setDate(reminderDate.getDate() - days);
      reminderDate.setHours(REMINDER_HOUR, REMINDER_MINUTE, 0, 0);

      // Only schedule if reminder date is in the future
      if (reminderDate.getTime() > Date.now()) {
        try {
          const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
              title: `🎁 Gift Reminder for ${event.personName}`,
              body: this.getReminderMessage(event, days),
              data: {
                eventId: event.id,
                personId: event.personId,
                personName: event.personName,
                daysUntil: days,
              },
              sound: true,
            },
            trigger: {
              date: reminderDate,
            },
          });

          notificationIds.push(notificationId);
          console.log(
            `Scheduled ${days}d reminder for ${event.personName} at ${reminderDate.toISOString()}`
          );
        } catch (error) {
          console.error(`Failed to schedule ${days}d reminder:`, error);
        }
      }
    }

    return notificationIds;
  }

  /**
   * Cancel all reminders for an event
   */
  async cancelEventReminders(eventId: string): Promise<void> {
    try {
      // Get all scheduled notifications
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

      // Filter notifications for this event
      const eventNotifications = scheduledNotifications.filter(
        (notification) => notification.content.data?.eventId === eventId
      );

      // Cancel each notification
      for (const notification of eventNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        console.log(`Cancelled notification ${notification.identifier} for event ${eventId}`);
      }
    } catch (error) {
      console.error('Error cancelling event reminders:', error);
      throw error;
    }
  }

  /**
   * Reschedule reminders (cancel old ones and schedule new ones)
   */
  async rescheduleEventReminders(event: GiftEvent): Promise<string[]> {
    await this.cancelEventReminders(event.id);
    return await this.scheduleEventReminders(event);
  }

  /**
   * Get all scheduled notifications
   */
  async getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  /**
   * Cancel all notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Cancelled all notifications');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
      throw error;
    }
  }

  /**
   * Get reminder message based on days until event
   */
  private getReminderMessage(event: GiftEvent, daysUntil: number): string {
    const eventTypeText =
      event.eventType === 'birthday' ? 'birthday' : event.eventType;

    if (daysUntil === 1) {
      return `${eventTypeText} is tomorrow! Time to get a gift ready.`;
    } else if (daysUntil === 7) {
      return `${eventTypeText} is in one week. Start thinking about gift ideas!`;
    } else if (daysUntil === 30) {
      return `${eventTypeText} is in one month. Plan ahead!`;
    } else {
      return `${eventTypeText} is in ${daysUntil} days.`;
    }
  }

  /**
   * Handle notification tap (when user clicks on notification)
   */
  addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  /**
   * Handle notification received while app is foregrounded
   */
  addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(callback);
  }
}

export const notificationsService = new NotificationsService();
