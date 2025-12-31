// Group Type Definitions

export interface Group {
  id: string;
  name: string;
  memberIds: string[]; // Array of person IDs
  createdAt: Date;
  updatedAt: Date;
}

// Type for creating a new group
export type CreateGroupInput = Omit<Group, 'id' | 'createdAt' | 'updatedAt'>;

// Type for updating a group
export type UpdateGroupInput = Partial<Omit<Group, 'id' | 'createdAt'>> & { id: string };
