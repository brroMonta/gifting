// Person Repository - CRUD operations for people
import { orderBy, where } from 'firebase/firestore';
import { FirestoreService } from '../services/firestore.service';
import { Person, CreatePersonInput, UpdatePersonInput } from '../types/person';
import { COLLECTIONS } from '../utils/constants';

export class PersonRepository extends FirestoreService<Person> {
  constructor() {
    super(COLLECTIONS.PEOPLE);
  }

  /**
   * Get all people for a user, sorted by name
   */
  async getAllPeople(userId: string): Promise<Person[]> {
    return this.getAll(userId, [orderBy('name', 'asc')]);
  }

  /**
   * Get a single person by ID
   */
  async getPerson(userId: string, personId: string): Promise<Person | null> {
    return this.getById(userId, personId);
  }

  /**
   * Create a new person
   */
  async createPerson(userId: string, data: CreatePersonInput): Promise<string> {
    const personData = {
      name: data.name,
      relationship: data.relationship,
      birthdayMonth: data.birthdayMonth,
      birthdayDay: data.birthdayDay,
      birthdayYear: data.birthdayYear,
      notes: data.notes || '',
      groupIds: data.groupIds || [],
    };
    return this.create(userId, personData);
  }

  /**
   * Update a person
   */
  async updatePerson(userId: string, data: UpdatePersonInput): Promise<void> {
    const { id, ...updates } = data;
    return this.update(userId, id, updates);
  }

  /**
   * Delete a person
   */
  async deletePerson(userId: string, personId: string): Promise<void> {
    return this.delete(userId, personId);
  }

  /**
   * Get people by group ID
   */
  async getPeopleByGroup(userId: string, groupId: string): Promise<Person[]> {
    return this.getAll(userId, [
      where('groupIds', 'array-contains', groupId),
      orderBy('name', 'asc'),
    ]);
  }

  /**
   * Search people by name
   */
  async searchPeople(userId: string, searchTerm: string): Promise<Person[]> {
    const allPeople = await this.getAllPeople(userId);
    const lowerSearchTerm = searchTerm.toLowerCase();
    return allPeople.filter((person) =>
      person.name.toLowerCase().includes(lowerSearchTerm)
    );
  }
}

// Export a singleton instance
export const personRepository = new PersonRepository();
