/**
 * Format utilities (ported from Vibeface)
 */
export function formatCurrency(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return "$0";
  if (n >= 1000000) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${Math.round(n).toLocaleString()}`;
}
