'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { ErrorCard } from '@/components/containers/error-card';
import { Typography } from '@/components/ui/typography';
import {
  useTransactionSummary,
  useUpdateTransactionSummary,
  useConfirmQuote,
} from '@/lib/queries';
import { Select } from '@/components/ui/select';
import { QuoteOfferingComponent } from './quote-offering';
import { API_ERROR_MESSAGES, SUPPORTED_CURRENCIES_MAP } from '@/lib/constants';
import {
  TransactionError,
  TransactionSummary,
} from '@/lib/schemas/transaction';
import { AxiosError } from 'axios';
import { SupportedCurrencies } from '@/lib/schemas/pages';
import { Button } from '../ui/button';

export function AcceptQuoteComponent({ uuid }: { uuid: string }) {
  const [transaction, setTransaction] = useState<TransactionSummary | null>(
    null,
  );
  const [error, setError] = useState<TransactionError | null>(null);

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

  const paymentOptions: {
    value: SupportedCurrencies | 'none';
    label: string;
  }[] = [
    { value: 'none', label: 'Select currency' },
    {
      value: 'BTC',
      label: SUPPORTED_CURRENCIES_MAP['BTC'],
    },
    {
      value: 'ETH',
      label: SUPPORTED_CURRENCIES_MAP['ETH'],
    },
    {
      value: 'LTC',
      label: SUPPORTED_CURRENCIES_MAP['LTC'],
    },
  ];

  const hasSelectedPayment = useMemo(
    () => selectedPaymentMethod !== 'none',
    [selectedPaymentMethod],
  );

  const refreshQuote = useCallback(() => {
    if (selectedPaymentMethod === 'none') return;

    updateTransactionSummary({
      currency: selectedPaymentMethod as SupportedCurrencies,
      // This is hard-coded since the test only deals with crypto
      // But normally we would have a dictionary or API endpoint that displays all viable choices
      // and what their payInMethod is
      payInMethod: 'crypto',
    });
  }, [selectedPaymentMethod, updateTransactionSummary]);

  console.log(initialTransaction);
  useEffect(() => {
    const baseTransaction = updatedTransaction || initialTransaction;

    if (baseTransaction) {
      setTransaction(baseTransaction);
    }
  }, [initialTransaction, updatedTransaction]);

  useEffect(() => {
    if (initialTransaction?.paidCurrency?.currency) {
      // Auto select the payment method if it's already been set in another session
      handleSelectPaymentMethod(initialTransaction.paidCurrency?.currency);
    }
  }, [initialTransaction]);

  if (transaction?.status === 'EXPIRED') {
    redirect(`/payin/${uuid}/expired`);
  }

  if (transaction?.quoteStatus === 'ACCEPTED') {
    redirect(`/payin/${uuid}/pay`);
  }

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
      currency: paymentMethod as SupportedCurrencies,
      // This is hard-coded since the test only deals with crypto
      // But normally we would have a dictionary or API endpoint that displays all viable choices
      // and what their payInMethod is
      payInMethod: 'crypto',
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
          <Typography size='lg' weight='medium'>
            {transaction?.merchantDisplayName}
          </Typography>

          <div className='flex flex-row items-end gap-2'>
            <Typography size='xl' weight='semibold'>
              {transaction?.displayCurrency.amount}
            </Typography>
            <Typography
              size='lg'
              weight='semibold'
              className='relative -top-[2px]'
            >
              {transaction?.displayCurrency.currency}
            </Typography>
          </div>
        </div>

        <div className='flex flex-row items-center gap-1'>
          <Typography
            size='md'
            weight='regular'
            tag='span'
            className='text-grays-text'
          >
            For reference number:
          </Typography>
          <Typography size='md' weight='medium' tag='span'>
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
          />
        </div>

        {hasSelectedPayment && (
          <QuoteOfferingComponent
            transaction={updatedTransaction}
            refreshQuote={refreshQuote}
            confirmQuote={handleConfirmQuote}
            isLoading={isUpdatePending || isConfirmPending}
          />
        )}

        <Button
          onClick={handleConfirmQuote}
          disabled={isUpdatePending || isConfirmPending}
          className='w-full'
        >
          Confirm
        </Button>
      </div>
    </Card>
  );
}
