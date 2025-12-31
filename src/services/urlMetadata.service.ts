// URL Metadata Service - Extract images and metadata from URLs
import { Platform } from 'react-native';

export interface UrlMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

/**
 * Fetch metadata from a URL using Microlink API (free service)
 * This avoids CORS issues by using a proxy service
 */
export async function fetchUrlMetadata(url: string): Promise<UrlMetadata | null> {
  try {
    // Validate URL
    const urlObj = new URL(url);
    if (!urlObj.protocol.startsWith('http')) {
      return null;
    }

    // Use Microlink API with options to get better product images
    // palette=false saves bandwidth, screenshot=true ensures we get an image
    const apiUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&palette=false&screenshot=true&meta=false`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn('Failed to fetch URL metadata:', response.status);
      return null;
    }

    const data = await response.json();

    if (data.status !== 'success' || !data.data) {
      return null;
    }

    // Extract best image (prefer product images over logos)
    let imageUrl = null;

    // Priority 1: Use the main image (usually product image)
    if (data.data.image?.url) {
      const img = data.data.image.url;
      // Filter out logos and small images
      if (!isLogoImage(img) && !isTooSmall(data.data.image)) {
        imageUrl = img;
      }
    }

    // Priority 2: Try fetching HTML directly to parse og:image
    if (!imageUrl) {
      try {
        const htmlMetadata = await fetchHtmlDirectly(url);
        if (htmlMetadata?.image && !isLogoImage(htmlMetadata.image)) {
          imageUrl = htmlMetadata.image;
        }
      } catch (e) {
        // Fallback failed, continue
      }
    }

    // Priority 3: Use screenshot as last resort (captures whole page)
    if (!imageUrl && data.data.screenshot?.url) {
      imageUrl = data.data.screenshot.url;
    }

    // Extract metadata from Microlink response
    const metadata: UrlMetadata = {
      title: data.data.title || null,
      description: data.data.description || null,
      image: imageUrl,
      siteName: data.data.publisher || null,
    };

    return metadata;
  } catch (error) {
    console.error('Error fetching URL metadata:', error);
    return null;
  }
}

/**
 * Attempt to fetch HTML directly and parse Open Graph tags
 * This is a fallback for when Microlink doesn't give good results
 */
async function fetchHtmlDirectly(url: string): Promise<UrlMetadata | null> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GiftingApp/1.0)',
      },
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    return parseHtmlMetadata(html, url);
  } catch (error) {
    // CORS or network error, this is expected
    return null;
  }
}

/**
 * Check if an image URL is likely a logo
 */
function isLogoImage(url: string): boolean {
  const lowerUrl = url.toLowerCase();
  const logoPatterns = [
    'logo',
    'prime-logo',
    'amazon-prime',
    'brand',
    'favicon',
    'icon',
    '/sprite',
    'badge',
    'avatar',
  ];
  return logoPatterns.some(pattern => lowerUrl.includes(pattern));
}

/**
 * Check if image dimensions are too small (likely an icon)
 */
function isTooSmall(imageData: any): boolean {
  if (!imageData.width || !imageData.height) {
    return false; // Unknown size, allow it
  }
  // Filter out images smaller than 200x200
  return imageData.width < 200 || imageData.height < 200;
}

/**
 * Parse HTML to extract Open Graph and meta tags
 */
function parseHtmlMetadata(html: string, baseUrl: string): UrlMetadata {
  const metadata: UrlMetadata = {};

  // Extract Open Graph image (priority 1 - most reliable for products)
  const ogImage = extractMetaContent(html, 'property', 'og:image');
  if (ogImage && !isLogoImage(ogImage)) {
    metadata.image = resolveUrl(ogImage, baseUrl);
  }

  // Fallback to twitter:image
  if (!metadata.image) {
    const twitterImage = extractMetaContent(html, 'name', 'twitter:image');
    if (twitterImage && !isLogoImage(twitterImage)) {
      metadata.image = resolveUrl(twitterImage, baseUrl);
    }
  }

  // For Amazon specifically, look for product images
  if (!metadata.image && baseUrl.includes('amazon')) {
    // Amazon product images often have this pattern
    const amazonImgMatch = html.match(/https:\/\/[^"']*?images-na\.ssl-images-amazon\.com[^"']*?\.jpg/i);
    if (amazonImgMatch) {
      metadata.image = amazonImgMatch[0];
    }
  }

  // Fallback to largest image in content
  if (!metadata.image) {
    const imgMatches = html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi);
    for (const match of imgMatches) {
      const imgSrc = match[1];
      if (!isLogoImage(imgSrc)) {
        metadata.image = resolveUrl(imgSrc, baseUrl);
        break;
      }
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
