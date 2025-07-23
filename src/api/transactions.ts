import { AxiosError } from 'axios';
import { axiosInstance } from './axios-instance';
import {
  UpdateTransactionSummaryRequest,
  TransactionSummary,
  TransactionSummarySchema,
  TransactionError,
  TransactionErrorSchema,
} from '@/lib/schemas/transaction';

/**
 * Get the transaction summary for a given UUID, this is the start point of each transaction
 * @param uuid - The UUID of the transaction
 * @returns [TransactionSummary] - The transaction summary to be used in populating the accept quote page
 */
export const getTransactionSummary = async (
  uuid: string,
): Promise<TransactionSummary> => {
  try {
    const response = await axiosInstance.get(`/api/v1/pay/${uuid}/summary`);
    const summary = await TransactionSummarySchema.validate(response.data);
    return summary as TransactionSummary;
  } catch (error) {
    const errorResponse = error as AxiosError;
    console.error(errorResponse);
    try {
      const errorData = await TransactionErrorSchema.validate(
        errorResponse.response?.data,
      );
      throw errorData;
    } catch {
      throw error;
    }
  }
};

/**
 * Updates the transaction summary when a currency is selected, or when a quote is refreshed
 * @param uuid - The UUID of the transaction
 * @param request - The request object with currency and pa information
 * @returns [TransactionSummary] - The updated transaction summary
 */
export const updateTransactionSummary = async (
  uuid: string,
  request: UpdateTransactionSummaryRequest,
): Promise<TransactionSummary> => {
  try {
    const response = await axiosInstance.put(
      `/api/v1/pay/${uuid}/update/summary`,
      request,
    );
    const summary = await TransactionSummarySchema.validate(response.data);
    return summary as TransactionSummary;
  } catch (error) {
    const errorResponse = error as AxiosError;
    try {
      const errorData = await TransactionErrorSchema.validate(
        errorResponse.response?.data,
      );
      throw errorData;
    } catch {
      throw error;
    }
  }
};

/**
 * Confirms the quote for a given transaction
 * @param uuid - The UUID of the transaction
 * @returns [boolean] - Whether the quote was confirmed successfully
 */
export const confirmQuote = async (uuid: string): Promise<boolean> => {
  const response = await axiosInstance.put(
    `/api/v1/pay/${uuid}/accept/summary`,
  );
  return response.status === 200;
};
