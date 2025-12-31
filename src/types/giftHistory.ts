// Gift History Type Definitions

export type GiftDirection = 'gave' | 'received';

export interface GiftHistory {
  id: string;
  personId: string;
  personName: string; // Denormalized
  giftName: string;
  direction: GiftDirection;
  date: Date;
  notes: string | null;
  link: string | null;
  photoUrl: string | null; // Firebase Storage path
  createdAt: Date;
  updatedAt: Date;
}

// Type for creating a new gift history entry
export type CreateGiftHistoryInput = Omit<GiftHistory, 'id' | 'createdAt' | 'updatedAt'>;

// Type for updating a gift history entry
export type UpdateGiftHistoryInput = Partial<Omit<GiftHistory, 'id' | 'createdAt'>> & {
  id: string;
};
