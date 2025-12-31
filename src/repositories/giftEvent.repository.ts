// Gift Event Repository - Firestore operations for gift events
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { GiftEvent, CreateGiftEventInput } from '../types/giftEvent';
import { COLLECTIONS } from '../utils/constants';

class GiftEventRepository {
  /**
   * Get all events for a user
   */
  async getAllEvents(userId: string): Promise<GiftEvent[]> {
    const eventsRef = collection(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.GIFT_EVENTS}`);
    const q = query(eventsRef, orderBy('eventDate', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        eventDate: data.eventDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as GiftEvent;
    });
  }

  /**
   * Get a single event by ID
   */
  async getEvent(userId: string, eventId: string): Promise<GiftEvent | null> {
    const eventRef = doc(
      db,
      `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.GIFT_EVENTS}/${eventId}`
    );
    const snapshot = await getDoc(eventRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
      eventDate: data.eventDate?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as GiftEvent;
  }

  /**
   * Get events for a specific person
   */
  async getEventsByPerson(userId: string, personId: string): Promise<GiftEvent[]> {
    const eventsRef = collection(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.GIFT_EVENTS}`);
    const q = query(
      eventsRef,
      where('personId', '==', personId),
      orderBy('eventDate', 'asc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        eventDate: data.eventDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as GiftEvent;
    });
  }

  /**
   * Get upcoming events (within next 60 days)
   */
  async getUpcomingEvents(userId: string): Promise<GiftEvent[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 60);

    const eventsRef = collection(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.GIFT_EVENTS}`);
    const q = query(
      eventsRef,
      where('eventDate', '>=', Timestamp.fromDate(now)),
      where('eventDate', '<=', Timestamp.fromDate(futureDate)),
      orderBy('eventDate', 'asc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        eventDate: data.eventDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as GiftEvent;
    });
  }

  /**
   * Create a new event
   */
  async createEvent(userId: string, input: CreateGiftEventInput): Promise<string> {
    const eventsRef = collection(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.GIFT_EVENTS}`);

    const eventData = {
      personId: input.personId,
      personName: input.personName,
      eventType: input.eventType,
      eventDate: Timestamp.fromDate(input.eventDate),
      status: input.status || 'idea',
      remindersEnabled: input.remindersEnabled !== undefined ? input.remindersEnabled : true,
      remindersSent: [],
      notes: input.notes || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(eventsRef, eventData);
    return docRef.id;
  }

  /**
   * Update an event
   */
  async updateEvent(
    userId: string,
    eventId: string,
    updates: Partial<CreateGiftEventInput>
  ): Promise<void> {
    const eventRef = doc(
      db,
      `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.GIFT_EVENTS}/${eventId}`
    );

    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    // Convert eventDate to Timestamp if present
    if (updates.eventDate) {
      updateData.eventDate = Timestamp.fromDate(updates.eventDate);
    }

    await updateDoc(eventRef, updateData);
  }

  /**
   * Delete an event
   */
  async deleteEvent(userId: string, eventId: string): Promise<void> {
    const eventRef = doc(
      db,
      `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.GIFT_EVENTS}/${eventId}`
    );
    await deleteDoc(eventRef);
  }

  /**
   * Update event status
   */
  async updateEventStatus(
    userId: string,
    eventId: string,
    status: 'idea' | 'shopping' | 'bought' | 'delivered'
  ): Promise<void> {
    await this.updateEvent(userId, eventId, { status });
  }
}

export const giftEventRepository = new GiftEventRepository();
