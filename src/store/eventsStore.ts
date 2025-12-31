// Gift Events Store - Zustand State Management for Gift Events
import { create } from 'zustand';
import { GiftEvent, CreateGiftEventInput } from '../types/giftEvent';
import { giftEventRepository } from '../repositories/giftEvent.repository';
import { notificationsService } from '../services/notifications.service';

interface EventsState {
  events: GiftEvent[];
  upcomingEvents: GiftEvent[];
  selectedEvent: GiftEvent | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchEvents: (userId: string) => Promise<void>;
  fetchUpcomingEvents: (userId: string) => Promise<void>;
  fetchEventsByPerson: (userId: string, personId: string) => Promise<void>;
  fetchEvent: (userId: string, eventId: string) => Promise<void>;
  createEvent: (userId: string, input: CreateGiftEventInput) => Promise<void>;
  updateEvent: (userId: string, eventId: string, updates: Partial<CreateGiftEventInput>) => Promise<void>;
  deleteEvent: (userId: string, eventId: string) => Promise<void>;
  updateEventStatus: (userId: string, eventId: string, status: 'idea' | 'shopping' | 'bought' | 'delivered') => Promise<void>;
  clearError: () => void;
}

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  upcomingEvents: [],
  selectedEvent: null,
  loading: false,
  error: null,

  fetchEvents: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const events = await giftEventRepository.getAllEvents(userId);
      set({ events, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch events' });
      throw error;
    }
  },

  fetchUpcomingEvents: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const upcomingEvents = await giftEventRepository.getUpcomingEvents(userId);
      set({ upcomingEvents, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch upcoming events' });
      throw error;
    }
  },

  fetchEventsByPerson: async (userId: string, personId: string) => {
    set({ loading: true, error: null });
    try {
      const events = await giftEventRepository.getEventsByPerson(userId, personId);
      set({ events, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch events' });
      throw error;
    }
  },

  fetchEvent: async (userId: string, eventId: string) => {
    set({ loading: true, error: null });
    try {
      const selectedEvent = await giftEventRepository.getEvent(userId, eventId);
      set({ selectedEvent, loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch event' });
      throw error;
    }
  },

  createEvent: async (userId: string, input: CreateGiftEventInput) => {
    set({ loading: true, error: null });
    try {
      const eventId = await giftEventRepository.createEvent(userId, input);

      // Schedule notifications if reminders are enabled
      if (input.remindersEnabled) {
        const event = await giftEventRepository.getEvent(userId, eventId);
        if (event) {
          try {
            await notificationsService.scheduleEventReminders(event);
          } catch (notifError) {
            console.error('Failed to schedule notifications:', notifError);
            // Don't fail the whole operation if notifications fail
          }
        }
      }

      await get().fetchEvents(userId);
      await get().fetchUpcomingEvents(userId);
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to create event' });
      throw error;
    }
  },

  updateEvent: async (userId: string, eventId: string, updates: Partial<CreateGiftEventInput>) => {
    set({ loading: true, error: null });
    try {
      await giftEventRepository.updateEvent(userId, eventId, updates);

      // Reschedule notifications if reminders settings or event date changed
      const event = await giftEventRepository.getEvent(userId, eventId);
      if (event) {
        try {
          if (event.remindersEnabled) {
            await notificationsService.rescheduleEventReminders(event);
          } else {
            await notificationsService.cancelEventReminders(eventId);
          }
        } catch (notifError) {
          console.error('Failed to update notifications:', notifError);
          // Don't fail the whole operation if notifications fail
        }
      }

      await get().fetchEvents(userId);
      await get().fetchUpcomingEvents(userId);
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update event' });
      throw error;
    }
  },

  deleteEvent: async (userId: string, eventId: string) => {
    set({ loading: true, error: null });
    try {
      // Cancel notifications before deleting
      try {
        await notificationsService.cancelEventReminders(eventId);
      } catch (notifError) {
        console.error('Failed to cancel notifications:', notifError);
        // Continue with deletion even if notification cancellation fails
      }

      await giftEventRepository.deleteEvent(userId, eventId);
      await get().fetchEvents(userId);
      await get().fetchUpcomingEvents(userId);
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to delete event' });
      throw error;
    }
  },

  updateEventStatus: async (userId: string, eventId: string, status: 'idea' | 'shopping' | 'bought' | 'delivered') => {
    set({ loading: true, error: null });
    try {
      await giftEventRepository.updateEventStatus(userId, eventId, status);
      await get().fetchEvents(userId);
      await get().fetchUpcomingEvents(userId);
      set({ loading: false });
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update status' });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
