/**
 * Validates registration input
 * @param url - Website URL
 * @param price - Price in USDC (as string)
 * @returns Error message if invalid, null if valid
 */
export function validateRegistration(url: string, price: string): string | null {
  if (!url || !price) {
    return 'Please enter both URL and price';
  }

  const priceNum = parseFloat(price);
  if (isNaN(priceNum) || priceNum <= 0) {
    return 'Please enter a valid price > 0';
  }

  // Basic URL validation
  try {
    new URL(url);
  } catch {
    return 'Please enter a valid URL (include https://)';
  }

  return null;
}

