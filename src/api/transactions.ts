// API
import { axiosInstance } from '@/api/axios-instance';

// Utils
import {
  UpdateTransactionSummaryRequest,
  TransactionSummary,
  TransactionSummarySchema,
} from '@/lib/schemas/transaction';
import {
  SupportedCurrenciesSchema,
  SupportedCurrencies,
} from '@/lib/schemas/currencies';
import { handleAPIError } from '@/lib/utils';
import { DEFAULT_CURRENCIES } from '@/lib/constants';

/**
 * Get the list of cryptocurrencies that are supported by the API
 * @returns [SupportedCurrencies] - The list of supported cryptocurrencies
 */
export const getSupportedCurrencies =
  async (): Promise<SupportedCurrencies> => {
    // META: Calling with max=100 as the API only has 54 currencies
    try {
      const response = await axiosInstance.get('/api/currency/crypto?max=100');
      const currencies = await SupportedCurrenciesSchema.validate(
        response.data,
      );
      return currencies;
    } catch {
      // Fallback to default currencies if the API call fails
      return DEFAULT_CURRENCIES;
    }
  };

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
    throw await handleAPIError(error);
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
    throw await handleAPIError(error);
  }
};

/**
 * Confirms the quote for a given transaction
 * @param uuid - The UUID of the transaction
 * @returns [boolean] - Whether the quote was confirmed successfully
 */
export const confirmQuote = async (uuid: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.put(
      `/api/v1/pay/${uuid}/accept/summary`,
    );
    return response.status === 200;
  } catch (error) {
    throw await handleAPIError(error);
  }
};
