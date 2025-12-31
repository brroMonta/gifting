// Gift Map Type Definitions

export interface GiftMapItem {
  id: string;
  name: string;
  url: string | null;
  notes: string | null;
  isReserved: boolean;
  reservedAt: Date | null;
  order: number;
}

export interface GiftMap {
  id: string; // Same as personId
  personId: string;
  personName: string; // Denormalized
  shareToken: string | null;
  isShared: boolean;
  items: GiftMapItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Type for creating a new gift map item
export type CreateGiftMapItemInput = Omit<GiftMapItem, 'id' | 'isReserved' | 'reservedAt' | 'order'>;

// Type for updating a gift map item
export type UpdateGiftMapItemInput = Partial<Omit<GiftMapItem, 'id'>>;

// Type for shared gift map (public view)
export interface SharedGiftMap {
  userId: string;
  giftMapId: string;
  personName: string;
  items: GiftMapItem[];
  expiresAt: Date | null;
  updatedAt: Date;
}
