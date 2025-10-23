import { type Address } from 'viem';
import { TOKEN_DECIMALS, TOKEN_METADATA } from '../constants';

/**
 * Format a token amount to human-readable string
 */
export function formatTokenAmount(
  amount: bigint,
  decimals: number = 18,
  maximumFractionDigits: number = 6
): string {
  const formatted = (Number(amount) / Math.pow(10, decimals)).toFixed(maximumFractionDigits);

  // Remove trailing zeros
  const trimmed = formatted.replace(/\.?0+$/, '');

  // If the number is very small, show more precision
  if (parseFloat(trimmed) === 0 && amount > BigInt(0)) {
    return (Number(amount) / Math.pow(10, decimals)).toPrecision(3);
  }

  return trimmed;
}

/**
 * Parse a token amount string to bigint
 */
export function parseTokenAmount(amount: string, decimals: number = 18): bigint {
  try {
    // Handle decimal input
    const cleanAmount = amount.replace(/[^0-9.]/g, '');
    const parts = cleanAmount.split('.');

    let whole = parts[0] || '0';
    let fractional = parts[1] || '';

    // Pad or truncate fractional part
    if (fractional.length > decimals) {
      fractional = fractional.slice(0, decimals);
    } else {
      fractional = fractional.padEnd(decimals, '0');
    }

    return BigInt(whole + fractional);
  } catch (error) {
    console.error('Error parsing token amount:', error);
    return BigInt(0);
  }
}

/**
 * Format an Ethereum address
 */
export function formatAddress(address: Address): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format an interest rate (basis points to percentage)
 */
export function formatInterestRate(rate: number): string {
  return `${(rate / 100).toFixed(2)}%`;
}

/**
 * Format a duration in seconds to human-readable format
 */
export function formatDuration(seconds: number): string {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

/**
 * Format currency value
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: bigint, total: bigint): number {
  if (total === BigInt(0)) return 0;
  return Number((value * BigInt(10000)) / total) / 100;
}

/**
 * Format percentage display
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format percentage display (alias for consistency)
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Get token info by address
 */
export function getTokenInfo(address: Address) {
  return TOKEN_METADATA[address as keyof typeof TOKEN_METADATA];
}

/**
 * Format token amount with symbol
 */
export function formatTokenWithSymbol(
  amount: bigint,
  tokenAddress: Address,
  maximumFractionDigits?: number
): string {
  const tokenInfo = getTokenInfo(tokenAddress);
  if (!tokenInfo) {
    return formatTokenAmount(amount, 18, maximumFractionDigits);
  }

  const formattedAmount = formatTokenAmount(
    amount,
    tokenInfo.decimals,
    maximumFractionDigits
  );

  return `${formattedAmount} ${tokenInfo.symbol}`;
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): address is Address {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      console.error('Failed to copy text:', fallbackError);
      return false;
    }
  }
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Format date to relative time
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  // For older dates, return the actual date
  return date.toLocaleDateString();
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Truncate text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}