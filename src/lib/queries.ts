import { useMutation, useQuery } from '@tanstack/react-query';

// API
import {
  getTransactionSummary,
  updateTransactionSummary,
  confirmQuote,
} from '@/api/transactions';

// Utils
import {
  TransactionError,
  UpdateTransactionSummaryRequest,
} from '@/lib/schemas/transaction';

export const TRANSACTION_SUMMARY_QUERY_KEY = 'transaction-summary';

export const useTransactionSummary = (uuid: string) => {
  return useQuery({
    queryKey: [TRANSACTION_SUMMARY_QUERY_KEY, uuid],
    queryFn: () => getTransactionSummary(uuid),
    retry: 3,
    retryDelay: 1000,
  });
};

export const useUpdateTransactionSummary = (uuid: string) => {
  return useMutation({
    onError: (error: TransactionError) => error,
    mutationFn: (summary: UpdateTransactionSummaryRequest) =>
      updateTransactionSummary(uuid, summary),
    retry: 3,
    retryDelay: 1000,
  });
};

export const useConfirmQuote = (uuid: string) => {
  return useMutation({
    onError: (error: TransactionError) => error,
    mutationFn: () => confirmQuote(uuid),
  });
};
