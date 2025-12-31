// Person Type Definition

export interface Person {
  id: string;
  name: string;
  relationship: string;
  birthdayMonth?: number; // 1-12
  birthdayDay?: number; // 1-31
  birthdayYear?: number; // Optional year
  notes: string;
  groupIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Type for creating a new person (without id and timestamps)
export type CreatePersonInput = Omit<Person, 'id' | 'createdAt' | 'updatedAt'>;

// Type for updating a person (all fields optional except id)
export type UpdatePersonInput = Partial<Omit<Person, 'id' | 'createdAt'>> & { id: string };
