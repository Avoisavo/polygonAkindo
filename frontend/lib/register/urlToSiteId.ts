import { keccak256, toBytes } from 'viem';

/**
 * Converts a URL to a unique siteId (bytes32) for the smart contract
 * @param url - The website URL to convert
 * @returns bytes32 hash of the normalized URL
 */
export function urlToSiteId(url: string): `0x${string}` {
  // Normalize URL (remove trailing slash, convert to lowercase)
  const normalizedUrl = url.trim().toLowerCase().replace(/\/$/, '');
  return keccak256(toBytes(normalizedUrl));
}

