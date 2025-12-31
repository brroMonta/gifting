// Gift Map Repository - CRUD operations for gift maps with sharing
import { doc, getDoc, setDoc, updateDoc, deleteDoc, Timestamp, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../services/firebase';
import { GiftMap, GiftMapItem, SharedGiftMap, CreateGiftMapItemInput } from '../types/giftMap';
import { COLLECTIONS } from '../utils/constants';
import { v4 as uuidv4 } from 'uuid';

export class GiftMapRepository {
  /**
   * Get a gift map for a person
   * Gift map ID is the same as person ID
   */
  async getGiftMap(userId: string, personId: string): Promise<GiftMap | null> {
    const docRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.GIFT_MAPS, personId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return this.fromFirestore(docSnap.data(), docSnap.id);
  }

  /**
   * Create a new gift map for a person
   */
  async createGiftMap(userId: string, personId: string, personName: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.GIFT_MAPS, personId);
    const now = Timestamp.now();

    await setDoc(docRef, {
      personId,
      personName,
      shareToken: null,
      isShared: false,
      items: [],
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Add an item to a gift map
   */
  async addItem(userId: string, personId: string, item: CreateGiftMapItemInput): Promise<string> {
    const docRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.GIFT_MAPS, personId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Gift map not found');
    }

    const giftMap = this.fromFirestore(docSnap.data(), docSnap.id);
    const itemId = uuidv4();
    const order = giftMap.items.length;

    const newItem: GiftMapItem = {
      id: itemId,
      name: item.name,
      url: item.url || null,
      notes: item.notes || null,
      isReserved: false,
      reservedAt: null,
      order,
    };

    await updateDoc(docRef, {
      items: arrayUnion(newItem),
      updatedAt: Timestamp.now(),
    });

    // If shared, sync to shared collection
    if (giftMap.isShared && giftMap.shareToken) {
      await this.syncToSharedMap(userId, personId, giftMap.shareToken);
    }

    return itemId;
  }

  /**
   * Update an item in a gift map
   */
  async updateItem(userId: string, personId: string, itemId: string, updates: Partial<GiftMapItem>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.GIFT_MAPS, personId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Gift map not found');
    }

    const giftMap = this.fromFirestore(docSnap.data(), docSnap.id);
    const updatedItems = giftMap.items.map((item) =>
      item.id === itemId ? { ...item, ...updates } : item
    );

    await updateDoc(docRef, {
      items: updatedItems,
      updatedAt: Timestamp.now(),
    });

    // If shared, sync to shared collection
    if (giftMap.isShared && giftMap.shareToken) {
      await this.syncToSharedMap(userId, personId, giftMap.shareToken);
    }
  }

  /**
   * Delete an item from a gift map
   */
  async deleteItem(userId: string, personId: string, itemId: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.GIFT_MAPS, personId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Gift map not found');
    }

    const giftMap = this.fromFirestore(docSnap.data(), docSnap.id);
    const updatedItems = giftMap.items.filter((item) => item.id !== itemId);

    await updateDoc(docRef, {
      items: updatedItems,
      updatedAt: Timestamp.now(),
    });

    // If shared, sync to shared collection
    if (giftMap.isShared && giftMap.shareToken) {
      await this.syncToSharedMap(userId, personId, giftMap.shareToken);
    }
  }

  /**
   * Generate a share link for a gift map
   */
  async generateShareLink(userId: string, personId: string): Promise<string> {
    const docRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.GIFT_MAPS, personId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Gift map not found');
    }

    const shareToken = uuidv4();

    // Update private gift map
    await updateDoc(docRef, {
      shareToken,
      isShared: true,
      updatedAt: Timestamp.now(),
    });

    // Create shared gift map
    await this.syncToSharedMap(userId, personId, shareToken);

    return shareToken;
  }

  /**
   * Disable sharing for a gift map
   */
  async disableSharing(userId: string, personId: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.GIFT_MAPS, personId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Gift map not found');
    }

    const giftMap = this.fromFirestore(docSnap.data(), docSnap.id);

    if (giftMap.shareToken) {
      // Delete shared gift map
      const sharedDocRef = doc(db, COLLECTIONS.SHARED_GIFT_MAPS, giftMap.shareToken);
      await deleteDoc(sharedDocRef);
    }

    // Update private gift map
    await updateDoc(docRef, {
      shareToken: null,
      isShared: false,
      updatedAt: Timestamp.now(),
    });
  }

  /**
   * Get a shared gift map by token (public access)
   */
  async getSharedGiftMap(shareToken: string): Promise<SharedGiftMap | null> {
    const docRef = doc(db, COLLECTIONS.SHARED_GIFT_MAPS, shareToken);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      userId: data.userId,
      giftMapId: data.giftMapId,
      personName: data.personName,
      items: data.items.map((item: any) => ({
        ...item,
        reservedAt: item.reservedAt?.toDate() || null,
      })),
      expiresAt: data.expiresAt?.toDate() || null,
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }

  /**
   * Reserve an item on a shared gift map
   */
  async reserveItem(shareToken: string, itemId: string): Promise<void> {
    const sharedDocRef = doc(db, COLLECTIONS.SHARED_GIFT_MAPS, shareToken);
    const sharedDocSnap = await getDoc(sharedDocRef);

    if (!sharedDocSnap.exists()) {
      throw new Error('Shared gift map not found');
    }

    const sharedData = sharedDocSnap.data();
    const updatedItems = sharedData.items.map((item: any) =>
      item.id === itemId
        ? { ...item, isReserved: true, reservedAt: Timestamp.now() }
        : item
    );

    // Update shared map
    await updateDoc(sharedDocRef, {
      items: updatedItems,
      updatedAt: Timestamp.now(),
    });

    // Update private map (sync back)
    const privateDocRef = doc(
      db,
      COLLECTIONS.USERS,
      sharedData.userId,
      COLLECTIONS.GIFT_MAPS,
      sharedData.giftMapId
    );
    await updateDoc(privateDocRef, {
      items: updatedItems,
      updatedAt: Timestamp.now(),
    });
  }

  /**
   * Unreserve an item on a shared gift map
   */
  async unreserveItem(shareToken: string, itemId: string): Promise<void> {
    const sharedDocRef = doc(db, COLLECTIONS.SHARED_GIFT_MAPS, shareToken);
    const sharedDocSnap = await getDoc(sharedDocRef);

    if (!sharedDocSnap.exists()) {
      throw new Error('Shared gift map not found');
    }

    const sharedData = sharedDocSnap.data();
    const updatedItems = sharedData.items.map((item: any) =>
      item.id === itemId
        ? { ...item, isReserved: false, reservedAt: null }
        : item
    );

    // Update shared map
    await updateDoc(sharedDocRef, {
      items: updatedItems,
      updatedAt: Timestamp.now(),
    });

    // Update private map (sync back)
    const privateDocRef = doc(
      db,
      COLLECTIONS.USERS,
      sharedData.userId,
      COLLECTIONS.GIFT_MAPS,
      sharedData.giftMapId
    );
    await updateDoc(privateDocRef, {
      items: updatedItems,
      updatedAt: Timestamp.now(),
    });
  }

  /**
   * Sync private gift map to shared collection
   */
  private async syncToSharedMap(userId: string, giftMapId: string, shareToken: string): Promise<void> {
    const privateDocRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.GIFT_MAPS, giftMapId);
    const privateDocSnap = await getDoc(privateDocRef);

    if (!privateDocSnap.exists()) {
      throw new Error('Gift map not found');
    }

    const giftMap = this.fromFirestore(privateDocSnap.data(), privateDocSnap.id);
    const sharedDocRef = doc(db, COLLECTIONS.SHARED_GIFT_MAPS, shareToken);

    await setDoc(sharedDocRef, {
      userId,
      giftMapId,
      personName: giftMap.personName,
      items: giftMap.items.map((item) => ({
        ...item,
        reservedAt: item.reservedAt ? Timestamp.fromDate(item.reservedAt) : null,
      })),
      expiresAt: null,
      updatedAt: Timestamp.now(),
    });
  }

  /**
   * Convert Firestore data to GiftMap
   */
  private fromFirestore(data: any, id: string): GiftMap {
    return {
      id,
      personId: data.personId,
      personName: data.personName,
      shareToken: data.shareToken || null,
      isShared: data.isShared || false,
      items: (data.items || []).map((item: any) => ({
        ...item,
        reservedAt: item.reservedAt?.toDate() || null,
      })),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }
}

// Export a singleton instance
export const giftMapRepository = new GiftMapRepository();
