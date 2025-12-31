// Firestore Service - Base CRUD Operations
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
  QueryConstraint,
  CollectionReference,
  DocumentReference,
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Generic Firestore service with common CRUD operations
 */
export class FirestoreService<T> {
  constructor(private collectionPath: string) {}

  /**
   * Get a collection reference
   */
  protected getCollectionRef(userId: string): CollectionReference {
    return collection(db, 'users', userId, this.collectionPath);
  }

  /**
   * Get a document reference
   */
  protected getDocRef(userId: string, docId: string): DocumentReference {
    return doc(db, 'users', userId, this.collectionPath, docId);
  }

  /**
   * Get all documents
   */
  async getAll(userId: string, constraints: QueryConstraint[] = []): Promise<T[]> {
    const collectionRef = this.getCollectionRef(userId);
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => this.fromFirestore(doc.data(), doc.id));
  }

  /**
   * Get a single document by ID
   */
  async getById(userId: string, docId: string): Promise<T | null> {
    const docRef = this.getDocRef(userId, docId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return this.fromFirestore(docSnap.data(), docSnap.id);
  }

  /**
   * Create a new document
   */
  async create(userId: string, data: any): Promise<string> {
    const collectionRef = this.getCollectionRef(userId);
    const dataWithTimestamps = {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(collectionRef, dataWithTimestamps);
    return docRef.id;
  }

  /**
   * Update an existing document
   */
  async update(userId: string, docId: string, data: Partial<any>): Promise<void> {
    const docRef = this.getDocRef(userId, docId);
    const dataWithTimestamp = {
      ...data,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(docRef, dataWithTimestamp);
  }

  /**
   * Delete a document
   */
  async delete(userId: string, docId: string): Promise<void> {
    const docRef = this.getDocRef(userId, docId);
    await deleteDoc(docRef);
  }

  /**
   * Convert Firestore data to typed object
   * Override this in subclasses for custom conversion
   */
  protected fromFirestore(data: any, id: string): T {
    return {
      id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as T;
  }

  /**
   * Convert typed object to Firestore data
   * Override this in subclasses for custom conversion
   */
  protected toFirestore(data: any): any {
    const { id, createdAt, updatedAt, ...rest } = data;
    return rest;
  }
}
