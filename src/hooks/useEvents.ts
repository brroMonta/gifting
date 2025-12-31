// useEvents Hook - Custom hook for events management
import { useEffect } from 'react';
import { useEventsStore } from '../store/eventsStore';
import { useAuth } from './useAuth';

/**
 * Custom hook to manage gift events state
 */
export const useEvents = () => {
  const { user } = useAuth();
  const {
    events,
    upcomingEvents,
    selectedEvent,
    loading,
    error,
    fetchEvents,
    fetchUpcomingEvents,
    fetchEventsByPerson,
    fetchEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    updateEventStatus,
    clearError,
  } = useEventsStore();

  // Auto-fetch events when user is available
  useEffect(() => {
    if (user?.uid) {
      fetchEvents(user.uid);
      fetchUpcomingEvents(user.uid);
    }
  }, [user]);

  return {
    events,
    upcomingEvents,
    selectedEvent,
    loading,
    error,
    fetchEvents: () => user?.uid ? fetchEvents(user.uid) : Promise.reject('No user'),
    fetchUpcomingEvents: () => user?.uid ? fetchUpcomingEvents(user.uid) : Promise.reject('No user'),
    fetchEventsByPerson: (personId: string) =>
      user?.uid ? fetchEventsByPerson(user.uid, personId) : Promise.reject('No user'),
    fetchEvent: (eventId: string) =>
      user?.uid ? fetchEvent(user.uid, eventId) : Promise.reject('No user'),
    createEvent: (input: any) =>
      user?.uid ? createEvent(user.uid, input) : Promise.reject('No user'),
    updateEvent: (eventId: string, updates: any) =>
      user?.uid ? updateEvent(user.uid, eventId, updates) : Promise.reject('No user'),
    deleteEvent: (eventId: string) =>
      user?.uid ? deleteEvent(user.uid, eventId) : Promise.reject('No user'),
    updateEventStatus: (eventId: string, status: 'idea' | 'shopping' | 'bought' | 'delivered') =>
      user?.uid ? updateEventStatus(user.uid, eventId, status) : Promise.reject('No user'),
    clearError,
  };
};
