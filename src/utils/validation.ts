// Validation Utility Functions
import { VALIDATION } from './constants';

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= VALIDATION.MIN_PASSWORD_LENGTH;
};

/**
 * Get password validation error message
 */
export const getPasswordError = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`;
  }
  return null;
};

/**
 * Get email validation error message
 */
export const getEmailError = (email: string): string | null => {
  if (!email) return 'Email is required';
  if (!isValidEmail(email)) return 'Invalid email format';
  return null;
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  if (!url) return true; // URL is optional
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get URL validation error message
 */
export const getUrlError = (url: string): string | null => {
  if (!url) return null; // URL is optional
  if (!isValidUrl(url)) return 'Invalid URL format';
  return null;
};

/**
 * Validate name length
 */
export const isValidName = (name: string): boolean => {
  return name.trim().length > 0 && name.length <= VALIDATION.MAX_NAME_LENGTH;
};

/**
 * Validate notes length
 */
export const isValidNotes = (notes: string): boolean => {
  return notes.length <= VALIDATION.MAX_NOTES_LENGTH;
};

/**
 * Validate birthday
 */
export const isValidBirthday = (month?: number, day?: number): boolean => {
  if (month === undefined || day === undefined) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  // Check for valid day in month
  const daysInMonth = new Date(2000, month, 0).getDate();
  return day <= daysInMonth;
};

/**
 * Validate photo file size
 */
export const isValidPhotoSize = (sizeInBytes: number): boolean => {
  return sizeInBytes <= VALIDATION.MAX_PHOTO_SIZE;
};
