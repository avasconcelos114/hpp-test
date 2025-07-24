'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { redirect } from 'next/navigation';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ErrorCard } from '@/components/containers/error-card';
import { Select, SelectOption } from '@/components/ui/select';
import { Typography } from '@/components/ui/typography';
import { QuoteOfferingComponent } from '@/components/containers/quote-offering';
import {
  useTransactionSummary,
  useUpdateTransactionSummary,
  useConfirmQuote,
} from '@/lib/queries';
import { API_ERROR_MESSAGES } from '@/lib/constants';
import {
  TransactionError,
  TransactionSummary,
} from '@/lib/schemas/transaction';

import { useAtom } from 'jotai';
import { supportedCurrenciesAtom } from '@/store/currencies';

export function AcceptQuoteComponent({ uuid }: { uuid: string }) {
  const [transaction, setTransaction] = useState<TransactionSummary | null>(
    null,
  );
  const [error, setError] = useState<TransactionError | null>(null);
  const [supportedCurrencies] = useAtom(supportedCurrenciesAtom);
  const { data: initialTransaction, error: initialError } =
    useTransactionSummary(uuid);
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
  } = useConfirmQuote(uuid);

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('none');

  const paymentOptions: SelectOption[] = useMemo(() => {
    const currencyOptions = transaction?.currencyOptions;

    if (!currencyOptions) return [];

    const options = currencyOptions.map((currency) => {
      const currencyName = supportedCurrencies?.find(
        (c) => c.code === currency.code,
      )?.name;

      return { value: currency.code, label: currencyName || currency.code };
    });

    return [{ value: 'none', label: 'Select currency' }, ...options];
  }, [transaction, supportedCurrencies]);

  const hasSelectedPayment = useMemo(
    () => selectedPaymentMethod !== 'none',
    [selectedPaymentMethod],
  );

  const refreshQuote = useCallback(() => {
    if (selectedPaymentMethod === 'none') return;

    updateTransactionSummary({
      currency: selectedPaymentMethod,
    });
  }, [selectedPaymentMethod, updateTransactionSummary]);

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
  }, [initialTransaction]);

  useEffect(() => {
    if (isConfirmSuccess) {
      redirect(`/payin/${uuid}/pay`);
    }
  }, [isConfirmSuccess, uuid]);

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
    }
  }, [updateError, initialError, uuid]);

  async function handleConfirmQuote() {
    await confirmQuote();
  }

  async function handleSelectPaymentMethod(paymentMethod: string) {
    setSelectedPaymentMethod(paymentMethod);
    if (paymentMethod === 'none') return;

    updateTransactionSummary({
      currency: paymentMethod,
    });
  }

  if (error) {
    return (
      <ErrorCard
        title={error.message || 'Error'}
        description={API_ERROR_MESSAGES[error.code]}
      />
    );
  }

  return (
    <Card className='w-[460px]'>
      <div className='flex flex-col items-center gap-[25px]'>
        <div className='flex flex-col items-center'>
          <Typography
            size='lg'
            weight='medium'
            tag='h2'
            tabIndex={0}
            ariaLabel={`Transaction details for merchant: ${transaction?.merchantDisplayName}`}
          >
            {transaction?.merchantDisplayName}
          </Typography>

          <div className='flex flex-row items-end gap-2'>
            <Typography
              size='xl'
              weight='semibold'
              tabIndex={0}
              ariaLabel={`Transaction amount: ${transaction?.displayCurrency.amount} ${transaction?.displayCurrency.currency}`}
            >
              {transaction?.displayCurrency.amount}
            </Typography>
            <Typography
              size='lg'
              weight='semibold'
              className='relative -top-[2px]'
              aria-hidden='true'
              role='presentation'
            >
              {transaction?.displayCurrency.currency}
            </Typography>
          </div>
        </div>

        <div
          className='flex flex-row items-center gap-1'
          role='group'
          tabIndex={0}
          aria-label={`Transaction reference number: ${transaction?.reference}`}
        >
          <Typography
            size='md'
            weight='regular'
            tag='span'
            className='text-grays-text'
            aria-hidden='true'
            role='presentation'
          >
            For reference number:
          </Typography>
          <Typography
            size='md'
            weight='medium'
            tag='span'
            aria-hidden='true'
            role='presentation'
          >
            {transaction?.reference}
          </Typography>
        </div>

        <div className='flex w-full flex-col items-start gap-2'>
          <Select
            id='pay-with-select'
            value={selectedPaymentMethod}
            label='Pay with'
            onChange={(e) => handleSelectPaymentMethod(e.target.value)}
            options={paymentOptions}
            ariaLabel={`Select payment method`}
          />
        </div>

        {hasSelectedPayment && (
          <>
            <QuoteOfferingComponent
              transaction={updatedTransaction}
              refreshQuote={refreshQuote}
              isLoading={isUpdatePending || isConfirmPending}
            />
            <Button
              onClick={handleConfirmQuote}
              disabled={isUpdatePending || isConfirmPending}
              className='w-full'
              data-testid='confirm-quote-button'
            >
              Confirm
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
