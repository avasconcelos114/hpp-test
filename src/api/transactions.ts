import { axiosInstance } from './axios-instance';
import {
  UpdateTransactionSummaryRequest,
  TransactionSummary,
  TransactionSummarySchema,
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
    console.log(JSON.stringify(response.data, null, 2));
    const summary = await TransactionSummarySchema.validate(response.data);
    return summary as TransactionSummary;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Updates the transaction summary when a currency is selected
 * @param uuid - The UUID of the transaction
 * @param request - The request object with currency and pa information
 * @returns [boolean] - Whether the transaction summary was updated successfully
 */
export const updateTransactionSummary = async (
  uuid: string,
  request: UpdateTransactionSummaryRequest,
): Promise<boolean> => {
  try {
    const response = await axiosInstance.put(
      `/api/v1/pay/${uuid}/update/summary`,
      request,
    );
    return response.status === 200;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Refresh the transaction summary for a given UUID, this is the start point of each transaction
 * @param uuid - The UUID of the transaction
 * @returns [boolean] - Whether the transaction summary was refreshed successfully
 */
export const refreshQuote = async (uuid: string) => {
  const response = await axiosInstance.put(`/api/v1/pay/${uuid}/summary`);
  return response.data;
};

export const acceptSummary = async (uuid: string): Promise<boolean> => {
  const response = await axiosInstance.put(
    `/api/v1/pay/${uuid}/accept/summary`,
  );
  return response.status === 200;
};
