import { useAtom } from 'jotai';
import { useTransactionSummary } from '@/lib/queries';
import { supportedCurrenciesAtom } from '@/store/currencies';
import { useTimer } from './useTimer';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';

export function usePayQuoteState(uuid: string) {
  const { data: transaction } = useTransactionSummary(uuid);

  const [supportedCurrencies] = useAtom(supportedCurrenciesAtom);
  const [isMounted, setIsMounted] = useState(false);
  const { formattedTimeUntilExpiry, isExpired } = useTimer(
    transaction?.expiryDate ?? null,
  );

  if (isExpired) {
    redirect(`/payin/${uuid}/expired`);
  }

  if (transaction && transaction?.quoteStatus !== 'ACCEPTED') {
    // If no quote has been accepted yet, redirect to the accept quote page
    redirect(`/payin/${uuid}`);
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return {
    isMounted,
    formattedTimeUntilExpiry,
    isExpired,
    transaction,
    supportedCurrencies,
  };
}
