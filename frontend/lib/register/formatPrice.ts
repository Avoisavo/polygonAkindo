import { formatUnits } from 'viem';

/**
 * Formats a USDC price for display
 * USDC uses 6 decimals
 * @param price - Price in smallest unit (e.g., 1000000 = 1 USDC)
 * @returns Formatted price string (e.g., "1.000000")
 */
export function formatPrice(price: bigint | undefined): string {
  if (!price) return '0';
  return formatUnits(price, 6);
}

