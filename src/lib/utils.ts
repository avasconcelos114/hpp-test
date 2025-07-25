import { isAxiosError } from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utils
import {
  TransactionError,
  TransactionErrorSchema,
} from '@/lib/schemas/transaction';

/**
 * Merges multiple class values into a single string
 * @param inputs - The class values to merge
 * @returns The merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Shortens an address to the first 6 and last 4 characters
 * @param address - The address to shorten
 * @returns The shortened address
 */
export function shortenAddress(address: string) {
  if (!address) return '';
  if (address.length < 10) return address;

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export async function handleAPIError(
  error: unknown,
): Promise<TransactionError | unknown> {
  if (isAxiosError(error)) {
    const errorData = await TransactionErrorSchema.validate(
      error.response?.data,
    );
    return errorData;
  }
  return error;
}
