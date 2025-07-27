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
  if (address.length < 12) return address;

  return `${address.slice(0, 7)}...${address.slice(-5)}`;
}

/**
 * Handles API errors and returns a TransactionError if the error is an Axios error
 * @param error - The error to handle
 * @returns The TransactionError or the original error
 */
export async function handleAPIError(
  error: unknown,
): Promise<TransactionError | unknown> {
  if (isAxiosError(error)) {
    try {
      if (
        error.response?.data &&
        Array.isArray(error.response?.data.errorList)
      ) {
        // Handling cases where the API returns an array of errors
        // META: for the purposes of this test, we will be happy to just return the first error
        const errorData = await TransactionErrorSchema.validate(
          error.response?.data.errorList[0],
        );
        return errorData;
      }

      // Attempting to handle "standard" API errors
      const errorData = await TransactionErrorSchema.validate(
        error.response?.data,
      );
      return errorData;
    } catch (error) {
      return error;
    }
  }
  return error;
}
