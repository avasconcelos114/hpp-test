import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { useAtom } from 'jotai';

import {
  useConfirmQuote,
  useTransactionSummary,
  useUpdateTransactionSummary,
} from '@/lib/queries';
import {
  TransactionError,
  TransactionSummary,
} from '@/lib/schemas/transaction';
import { supportedCurrenciesAtom } from '@/store/currencies';

export function useAcceptQuoteState(uuid: string) {
  /*********************************
   * Local States
   *********************************/
  const [transaction, setTransaction] = useState<TransactionSummary | null>(
    null,
  );
  const [error, setError] = useState<TransactionError | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('none');

  /*********************************
   * Atoms
   *********************************/
  const [supportedCurrencies] = useAtom(supportedCurrenciesAtom);

  /*********************************
   * Queries
   *********************************/
  const {
    data: initialTransaction,
    error: initialError,
    isPending: isInitialPending,
  } = useTransactionSummary(uuid);
  const {
    mutate: updateTransactionSummary,
    data: updatedTransaction,
    error: updateError,
    isPending: isUpdatePending,
  } = useUpdateTransactionSummary(uuid);
  const {
    mutate: confirmQuote,
    isPending: isConfirmPending,
    isSuccess: isConfirmSuccess,
    error: confirmError,
  } = useConfirmQuote(uuid);

  /*********************************
   * Handlers
   *********************************/
  const refreshQuote = useCallback(() => {
    if (selectedPaymentMethod === 'none') return;

    updateTransactionSummary({
      currency: selectedPaymentMethod,
    });
  }, [selectedPaymentMethod, updateTransactionSummary]);

  const handleSelectPaymentMethod = useCallback(
    async (paymentMethod: string) => {
      setSelectedPaymentMethod(paymentMethod);
      if (paymentMethod === 'none') return;

      updateTransactionSummary({
        currency: paymentMethod,
      });
    },
    [updateTransactionSummary, setSelectedPaymentMethod],
  );

  /*********************************
   * Side Effects
   *********************************/
  useEffect(() => {
    let baseTransaction = initialTransaction;

    if (updatedTransaction) {
      baseTransaction = {
        ...updatedTransaction,
        currencyOptions: initialTransaction?.currencyOptions,
      };
    }

    if (baseTransaction) {
      setTransaction(baseTransaction);
    }
  }, [initialTransaction, updatedTransaction]);

  useEffect(() => {
    const expiredCodes = ['MER-PAY-2004', 'MER-PAY-2017'];
    if (updateError && expiredCodes.includes(updateError?.code)) {
      // When the transaction has expired, we redirect to the expired page
      redirect(`/payin/${uuid}/expired`);
    } else if (updateError) {
      // For other error codes, we just change the error message
      setError(updateError);
    } else if (initialError) {
      // META: This is a workaround to get the error message from the AxiosError
      // because useQuery doesn't return the error message in the error object like useMutation does
      const axiosError = initialError as AxiosError;
      setError(axiosError.response?.data as unknown as TransactionError);
    } else if (confirmError) {
      setError(confirmError);
    }
  }, [updateError, initialError, confirmError, uuid]);

  useEffect(() => {
    if (initialTransaction?.status === 'EXPIRED') {
      redirect(`/payin/${uuid}/expired`);
    }

    if (initialTransaction?.quoteStatus === 'ACCEPTED') {
      redirect(`/payin/${uuid}/pay`);
    }

    if (initialTransaction?.paidCurrency?.currency) {
      // Auto select the payment method if it's already been set in another session
      handleSelectPaymentMethod(initialTransaction.paidCurrency?.currency);
    }
  }, [initialTransaction, uuid, handleSelectPaymentMethod]);

  useEffect(() => {
    if (isConfirmSuccess) {
      redirect(`/payin/${uuid}/pay`);
    }
  }, [isConfirmSuccess, uuid]);

  /*********************************
   * Computed Values
   *********************************/
  const isLoading = isUpdatePending || isInitialPending || isConfirmPending;

  return {
    transaction,
    error,
    isLoading,
    selectedPaymentMethod,
    supportedCurrencies,
    refreshQuote,
    handleSelectPaymentMethod,
    confirmQuote,
  };
}
