import { parseUnits } from 'viem';
import { urlToSiteId } from './urlToSiteId';
import { x402polyABI } from '../x402polyABI';
import { X402POLY_CONTRACT } from '../networkConfig';

/**
 * Prepares the arguments for registerSite contract call
 * @param url - Website URL
 * @param price - Price in USDC (as string, e.g., "0.01")
 * @returns Object with contract address, ABI, function name, and args
 */
export function prepareRegisterSite(url: string, price: string) {
  // USDC uses 6 decimals
  const priceInWei = parseUnits(price, 6);
  const siteId = urlToSiteId(url);

  return {
    address: X402POLY_CONTRACT,
    abi: x402polyABI,
    functionName: 'registerSite' as const,
    args: [siteId, priceInWei] as const,
  };
}

