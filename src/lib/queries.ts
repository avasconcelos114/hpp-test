import { getTransactionSummary } from '@/api/transactions';
import { useQuery } from '@tanstack/react-query';

export const TRANSACTION_SUMMARY_QUERY_KEY = 'transaction-summary';

export const useTransactionSummary = (uuid: string) => {
  return useQuery({
    queryKey: [TRANSACTION_SUMMARY_QUERY_KEY, uuid],
    queryFn: () => getTransactionSummary(uuid),
  });
};
