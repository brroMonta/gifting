// URL Metadata Service - Extract images and metadata from URLs
import { Platform } from 'react-native';

export interface UrlMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

/**
 * Fetch metadata from a URL (Open Graph tags, meta tags)
 * Note: Direct fetching may have CORS issues on web. For production,
 * consider using a service like LinkPreview.net or a serverless function.
 */
export async function fetchUrlMetadata(url: string): Promise<UrlMetadata | null> {
  try {
    // Validate URL
    const urlObj = new URL(url);
    if (!urlObj.protocol.startsWith('http')) {
      return null;
    }

    // Fetch HTML content
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GiftingApp/1.0)',
      },
    });

    if (!response.ok) {
      console.warn('Failed to fetch URL:', response.status);
      return null;
    }

    const html = await response.text();

    // Parse metadata from HTML
    const metadata = parseHtmlMetadata(html, url);
    return metadata;
  } catch (error) {
    console.error('Error fetching URL metadata:', error);
    return null;
  }
}

/**
 * Parse HTML to extract Open Graph and meta tags
 */
function parseHtmlMetadata(html: string, baseUrl: string): UrlMetadata {
  const metadata: UrlMetadata = {};

  // Extract Open Graph image
  const ogImage = extractMetaContent(html, 'property', 'og:image');
  if (ogImage) {
    metadata.image = resolveUrl(ogImage, baseUrl);
  }

  // Fallback to twitter:image
  if (!metadata.image) {
    const twitterImage = extractMetaContent(html, 'name', 'twitter:image');
    if (twitterImage) {
      metadata.image = resolveUrl(twitterImage, baseUrl);
    }
  }

  // Fallback to first image in content
  if (!metadata.image) {
    const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1]) {
      metadata.image = resolveUrl(imgMatch[1], baseUrl);
    }
  }

  // Extract title
  metadata.title =
    extractMetaContent(html, 'property', 'og:title') ||
    extractMetaContent(html, 'name', 'twitter:title') ||
    extractTitle(html);

  // Extract description
  metadata.description =
    extractMetaContent(html, 'property', 'og:description') ||
    extractMetaContent(html, 'name', 'description') ||
    extractMetaContent(html, 'name', 'twitter:description');

  // Extract site name
  metadata.siteName = extractMetaContent(html, 'property', 'og:site_name');

  return metadata;
}

/**
 * Extract content from meta tags
 */
function extractMetaContent(html: string, attr: string, value: string): string | null {
  const regex = new RegExp(
    `<meta[^>]+${attr}=["']${escapeRegex(value)}["'][^>]+content=["']([^"']+)["']`,
    'i'
  );
  const match = html.match(regex);
  if (match && match[1]) {
    return match[1];
  }

  // Try reverse order (content before property/name)
  const reverseRegex = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+${attr}=["']${escapeRegex(value)}["']`,
    'i'
  );
  const reverseMatch = html.match(reverseRegex);
  return reverseMatch && reverseMatch[1] ? reverseMatch[1] : null;
}

/**
 * Extract title from <title> tag
 */
function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match && match[1] ? match[1].trim() : null;
}

/**
 * Resolve relative URLs to absolute
 */
function resolveUrl(url: string, baseUrl: string): string {
  try {
    // Already absolute
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // Protocol-relative
    if (url.startsWith('//')) {
      const baseProtocol = new URL(baseUrl).protocol;
      return `${baseProtocol}${url}`;
    }

    // Absolute path
    if (url.startsWith('/')) {
      const base = new URL(baseUrl);
      return `${base.protocol}//${base.host}${url}`;
    }

    // Relative path
    return new URL(url, baseUrl).href;
  } catch {
    return url;
  }
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Validate if string is a valid URL
 */
export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
