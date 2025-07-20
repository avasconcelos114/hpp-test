import { useMutation, useQuery } from '@tanstack/react-query';
import * as transactionsApi from '@/api/transactions';
import { UpdateTransactionSummaryRequest } from '@/lib/types/transactions';

const queryKeys = {
  transactionSummary: (uuid: string) => ['transactionSummary', uuid],
};

export const useTransactionQueries = (uuid: string) => {
  const getTransactionSummaryQuery = useQuery({
    queryKey: queryKeys.transactionSummary(uuid),
    queryFn: () => transactionsApi.getTransactionSummary(uuid),
    enabled: !!uuid,
  });

  const updateTransactionSummaryQuery = useMutation({
    mutationFn: (request: UpdateTransactionSummaryRequest) =>
      transactionsApi.updateTransactionSummary(uuid, request),
  });

  const refreshQuoteQuery = useMutation({
    mutationFn: () => transactionsApi.refreshQuote(uuid),
  });

  const acceptQuoteQuery = useMutation({
    mutationFn: () => transactionsApi.acceptQuote(uuid),
  });

  return {
    getTransactionSummaryQuery,
    updateTransactionSummaryQuery,
    refreshQuoteQuery,
    acceptQuoteQuery,
  };
};
