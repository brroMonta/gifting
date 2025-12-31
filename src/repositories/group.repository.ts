// Group Repository - Firestore operations for groups
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { Group, CreateGroupInput } from '../types/group';
import { COLLECTIONS } from '../utils/constants';

class GroupRepository {
  /**
   * Get all groups for a user
   */
  async getAllGroups(userId: string): Promise<Group[]> {
    const groupsRef = collection(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.GROUPS}`);
    const q = query(groupsRef, orderBy('name', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Group;
    });
  }

  /**
   * Get a single group by ID
   */
  async getGroup(userId: string, groupId: string): Promise<Group | null> {
    const groupRef = doc(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.GROUPS}/${groupId}`);
    const snapshot = await getDoc(groupRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Group;
  }

  /**
   * Create a new group
   */
  async createGroup(userId: string, input: CreateGroupInput): Promise<string> {
    const groupsRef = collection(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.GROUPS}`);

    const groupData = {
      name: input.name,
      memberIds: input.memberIds || [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(groupsRef, groupData);
    return docRef.id;
  }

  /**
   * Update a group
   */
  async updateGroup(
    userId: string,
    groupId: string,
    updates: Partial<CreateGroupInput>
  ): Promise<void> {
    const groupRef = doc(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.GROUPS}/${groupId}`);

    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(groupRef, updateData);
  }

  /**
   * Delete a group
   */
  async deleteGroup(userId: string, groupId: string): Promise<void> {
    const groupRef = doc(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.GROUPS}/${groupId}`);
    await deleteDoc(groupRef);
  }

  /**
   * Add a person to a group
   */
  async addMember(userId: string, groupId: string, personId: string): Promise<void> {
    // Update the group's memberIds
    const groupRef = doc(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.GROUPS}/${groupId}`);
    await updateDoc(groupRef, {
      memberIds: arrayUnion(personId),
      updatedAt: Timestamp.now(),
    });

    // Update the person's groupIds (bidirectional relationship)
    const personRef = doc(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.PEOPLE}/${personId}`);
    await updateDoc(personRef, {
      groupIds: arrayUnion(groupId),
      updatedAt: Timestamp.now(),
    });
  }

  /**
   * Remove a person from a group
   */
  async removeMember(userId: string, groupId: string, personId: string): Promise<void> {
    // Update the group's memberIds
    const groupRef = doc(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.GROUPS}/${groupId}`);
    await updateDoc(groupRef, {
      memberIds: arrayRemove(personId),
      updatedAt: Timestamp.now(),
    });

    // Update the person's groupIds (bidirectional relationship)
    const personRef = doc(db, `${COLLECTIONS.USERS}/${userId}/${COLLECTIONS.PEOPLE}/${personId}`);
    await updateDoc(personRef, {
      groupIds: arrayRemove(groupId),
      updatedAt: Timestamp.now(),
    });
  }
}

export const groupRepository = new GroupRepository();
