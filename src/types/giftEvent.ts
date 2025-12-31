// Gift Event Type Definitions

export type EventType = 'birthday' | 'holiday' | 'custom';
export type EventStatus = 'idea' | 'shopping' | 'bought' | 'delivered';
export type ReminderInterval = '30d' | '7d' | '1d';

export interface GiftEvent {
  id: string;
  personId: string;
  personName: string; // Denormalized
  eventType: EventType;
  eventDate: Date;
  status: EventStatus;
  remindersEnabled: boolean;
  remindersSent: ReminderInterval[];
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Type for creating a new gift event
export type CreateGiftEventInput = Omit<
  GiftEvent,
  'id' | 'remindersSent' | 'createdAt' | 'updatedAt'
>;

// Type for updating a gift event
export type UpdateGiftEventInput = Partial<Omit<GiftEvent, 'id' | 'createdAt'>> & { id: string };
