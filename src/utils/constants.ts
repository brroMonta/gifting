// App Constants

// Reminder intervals (in days)
export const REMINDER_INTERVALS = [30, 7, 1] as const;

// Reminder time (9 AM)
export const REMINDER_HOUR = 9;
export const REMINDER_MINUTE = 0;

// Event types
export const EVENT_TYPES = ['birthday', 'holiday', 'anniversary', 'custom'] as const;

// Event statuses
export const EVENT_STATUSES = ['idea', 'shopping', 'bought', 'delivered'] as const;

// Gift history directions
export const GIFT_DIRECTIONS = {
  GAVE: 'gave',
  RECEIVED: 'received',
} as const;

// Firebase collection names
export const COLLECTIONS = {
  USERS: 'users',
  PEOPLE: 'people',
  GIFT_MAPS: 'gift_maps',
  GIFT_EVENTS: 'gift_events',
  GIFT_HISTORY: 'gift_history',
  GROUPS: 'groups',
  SHARED_GIFT_MAPS: 'shared_gift_maps',
} as const;

// Storage paths
export const STORAGE_PATHS = {
  HISTORY_PHOTOS: (userId: string, photoId: string) =>
    `users/${userId}/history_photos/${photoId}`,
} as const;

// Validation constants
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_NAME_LENGTH: 100,
  MAX_NOTES_LENGTH: 500,
  MAX_PHOTO_SIZE: 5 * 1024 * 1024, // 5MB
} as const;
