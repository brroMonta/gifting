// Gift History Repository - Firestore operations for gift history
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
import { GiftHistory, CreateGiftHistoryInput } from '../types/giftHistory';
import { COLLECTIONS } from '../utils/constants';

class GiftHistoryRepository {
  /**
   * Get all history entries for a user
   */
  async getAllHistory(userId: string): Promise<GiftHistory[]> {
    const historyRef = collection(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.GIFT_HISTORY}`);
    const q = query(historyRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as GiftHistory;
    });
  }

  /**
   * Get a single history entry by ID
   */
  async getHistoryEntry(userId: string, historyId: string): Promise<GiftHistory | null> {
    const historyRef = doc(
      db,
      `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.GIFT_HISTORY}/${historyId}`
    );
    const snapshot = await getDoc(historyRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
      date: data.date?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as GiftHistory;
  }

  /**
   * Get history entries for a specific person
   */
  async getHistoryByPerson(userId: string, personId: string): Promise<GiftHistory[]> {
    const historyRef = collection(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.GIFT_HISTORY}`);
    const q = query(
      historyRef,
      where('personId', '==', personId),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as GiftHistory;
    });
  }

  /**
   * Get gifts given (direction: 'gave')
   */
  async getGiftsGiven(userId: string): Promise<GiftHistory[]> {
    const historyRef = collection(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.GIFT_HISTORY}`);
    const q = query(
      historyRef,
      where('direction', '==', 'gave'),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as GiftHistory;
    });
  }

  /**
   * Get gifts received (direction: 'received')
   */
  async getGiftsReceived(userId: string): Promise<GiftHistory[]> {
    const historyRef = collection(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.GIFT_HISTORY}`);
    const q = query(
      historyRef,
      where('direction', '==', 'received'),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as GiftHistory;
    });
  }

  /**
   * Create a new history entry
   */
  async createHistoryEntry(userId: string, input: CreateGiftHistoryInput): Promise<string> {
    const historyRef = collection(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.GIFT_HISTORY}`);

    const historyData = {
      personId: input.personId,
      personName: input.personName,
      giftName: input.giftName,
      direction: input.direction,
      date: Timestamp.fromDate(input.date),
      notes: input.notes || '',
      link: input.link || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(historyRef, historyData);
    return docRef.id;
  }

  /**
   * Update a history entry
   */
  async updateHistoryEntry(
    userId: string,
    historyId: string,
    updates: Partial<CreateGiftHistoryInput>
  ): Promise<void> {
    const historyRef = doc(
      db,
      `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.GIFT_HISTORY}/${historyId}`
    );

    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    // Convert date to Timestamp if present
    if (updates.date) {
      updateData.date = Timestamp.fromDate(updates.date);
    }

    await updateDoc(historyRef, updateData);
  }

  /**
   * Delete a history entry
   */
  async deleteHistoryEntry(userId: string, historyId: string): Promise<void> {
    const historyRef = doc(
      db,
      `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.GIFT_HISTORY}/${historyId}`
    );
    await deleteDoc(historyRef);
  }
}

export const giftHistoryRepository = new GiftHistoryRepository();
