import { getTransactionSummary, refreshQuote } from '@/api/transactions';
import { useQuery } from '@tanstack/react-query';

export const TRANSACTION_SUMMARY_QUERY_KEY = 'transaction-summary';

export const useTransactionSummary = (uuid: string) => {
  return useQuery({
    queryKey: [TRANSACTION_SUMMARY_QUERY_KEY, uuid],
    queryFn: () => getTransactionSummary(uuid),
  });
};

export const useRefreshQuote = (
  uuid: string,
  enabled: boolean,
  expiresIn: number,
) => {
  return useQuery({
    queryKey: [TRANSACTION_SUMMARY_QUERY_KEY, uuid],
    queryFn: () => refreshQuote(uuid),
    enabled,
    refetchInterval: expiresIn * 1000,
  });
};
