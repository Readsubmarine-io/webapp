/**
 * Formats a Solana price value to a consistent display format
 * @param price - The price value in SOL (number or string)
 * @param includeUnit - Whether to include "SOL" unit in the output (default: false)
 * @returns Formatted price string
 */
export function formatSolanaPrice(
  price: number | string,
  includeUnit: boolean = false,
): string {
  console.log(price)

  const numericPrice = typeof price === 'string' ? parseFloat(price) : price

  if (isNaN(numericPrice) || numericPrice === 0) {
    return includeUnit ? '0 SOL' : '0'
  }

  const formatted = numericPrice.toFixed(6).replace(/\.?0+$/, '')
  return includeUnit ? `${formatted} SOL` : formatted
}
