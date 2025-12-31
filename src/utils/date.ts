// Date Utility Functions
import { format, formatDistanceToNow, isPast, isFuture, differenceInDays } from 'date-fns';

/**
 * Format a date to a readable string
 */
export const formatDate = (date: Date, formatStr: string = 'MMM d, yyyy'): string => {
  return format(date, formatStr);
};

/**
 * Format a date relative to now (e.g., "3 days ago", "in 2 weeks")
 */
export const formatRelativeDate = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};

/**
 * Check if a date is in the past
 */
export const isDatePast = (date: Date): boolean => {
  return isPast(date);
};

/**
 * Check if a date is in the future
 */
export const isDateFuture = (date: Date): boolean => {
  return isFuture(date);
};

/**
 * Get the number of days until a date
 */
export const getDaysUntil = (date: Date): number => {
  return differenceInDays(date, new Date());
};

/**
 * Create a birthday date for the current or next year
 * @param month - Month (1-12)
 * @param day - Day of month (1-31)
 * @param year - Optional specific year
 */
export const createBirthdayDate = (month: number, day: number, year?: number): Date => {
  const currentYear = new Date().getFullYear();
  const targetYear = year || currentYear;

  // Month is 0-indexed in JavaScript Date
  const birthdayDate = new Date(targetYear, month - 1, day);

  // If birthday has passed this year and no specific year provided, use next year
  if (!year && isPast(birthdayDate)) {
    birthdayDate.setFullYear(currentYear + 1);
  }

  return birthdayDate;
};

/**
 * Format birthday display (without year if not provided)
 */
export const formatBirthday = (month: number, day: number, year?: number): string => {
  const date = new Date(2000, month - 1, day); // Use a dummy year for formatting
  const formatted = format(date, 'MMMM d');

  if (year) {
    return `${formatted}, ${year}`;
  }

  return formatted;
};

/**
 * Calculate age from birthday
 */
export const calculateAge = (month: number, day: number, year: number): number => {
  const today = new Date();
  const birthDate = new Date(year, month - 1, day);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};
