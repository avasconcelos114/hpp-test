import {
  getTransactionSummary,
  updateTransactionSummary,
} from '@/api/transactions';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  TransactionError,
  UpdateTransactionSummaryRequest,
} from './schemas/transaction';

export const TRANSACTION_SUMMARY_QUERY_KEY = 'transaction-summary';

export const useTransactionSummary = (uuid: string) => {
  return useQuery({
    queryKey: [TRANSACTION_SUMMARY_QUERY_KEY, uuid],
    queryFn: () => getTransactionSummary(uuid),
    retry: false,
  });
};

export const useUpdateTransactionSummary = (uuid: string) => {
  return useMutation({
    onError: (error: TransactionError) => {
      return error;
    },
    mutationFn: (summary: UpdateTransactionSummaryRequest) =>
      updateTransactionSummary(uuid, summary),
  });
};
