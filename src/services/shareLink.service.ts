// Share Link Service - Generate and format share links
import { giftMapRepository } from '../repositories/giftMap.repository';

/**
 * Generate a shareable link for a gift map
 */
export const generateShareLink = async (userId: string, personId: string): Promise<string> => {
  const shareToken = await giftMapRepository.generateShareLink(userId, personId);
  return formatShareUrl(shareToken);
};

/**
 * Format a share token into a full URL
 */
export const formatShareUrl = (shareToken: string): string => {
  // In development, use localhost
  // In production, use your actual domain
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8081';
  return `${baseUrl}/shared/${shareToken}`;
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers or React Native
    throw new Error('Clipboard API not available');
  }
};
