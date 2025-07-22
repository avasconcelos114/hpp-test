'use client';
import { useState, useMemo, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { ErrorCard } from '@/components/containers/error-card';
import { Typography } from '@/components/ui/typography';
import {
  useTransactionSummary,
  useUpdateTransactionSummary,
} from '@/lib/queries';
import { Select } from '@/components/ui/select';
import { QuoteOfferingComponent } from './quote-offering';
import { API_ERROR_MESSAGES } from '@/lib/constants';
import {
  TransactionError,
  TransactionSummary,
} from '@/lib/schemas/transaction';
import { AxiosError } from 'axios';

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
    isError: isUpdateError,
    error: updateError,
    isPending: isUpdatePending,
  } = useUpdateTransactionSummary(uuid);

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('none');

  const paymentOptions = [
    { value: 'none', label: 'Select currency' },
    { value: 'BTC', label: 'Bitcoin' },
    { value: 'ETH', label: 'Ethereum' },
    { value: 'LTC', label: 'Litecoin' },
  ];

  const hasSelectedPayment = useMemo(
    () => selectedPaymentMethod !== 'none',
    [selectedPaymentMethod],
  );

  useEffect(() => {
    if (initialError) {
      const axiosError = initialError as AxiosError;
      setError(axiosError.response?.data as unknown as TransactionError);
    }
  }, [initialError, updateError]);

  if (transaction?.status === 'EXPIRED') {
    redirect(`/payin/${uuid}/expired`);
  }

  useEffect(() => {
    const expiredCodes = ['MER-PAY-2004', 'MER-PAY-2017'];
    if (
      isUpdateError &&
      updateError &&
      expiredCodes.includes(updateError?.code)
    ) {
      // When the transaction has expired, we redirect to the expired page
      redirect(`/payin/${uuid}/expired`);
    } else if (isUpdateError && updateError) {
      // For other error codes, we just change the error message
      setError(updateError);
    }
  }, [isUpdateError, updateError, error]);

  async function handleSelectPaymentMethod(paymentMethod: string) {
    console.log('handleSelectPaymentMethod', paymentMethod);
    setSelectedPaymentMethod(paymentMethod);
    updateTransactionSummary({
      currency: paymentMethod,

      // This is hard-coded since the test only deals with crypto
      // But normally we would have a dictionary or API endpoint that displays all viable choices
      // and what their payInMethod is
      payInMethod: 'crypto',
    });
  }

  if (error) {
    return (
      <ErrorCard title='Error' description={API_ERROR_MESSAGES[error.code]} />
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
            refreshQuote={() => {
              updateTransactionSummary({
                currency: selectedPaymentMethod,
                payInMethod: 'crypto',
              });
            }}
            isLoading={isUpdatePending}
          />
        )}
      </div>
    </Card>
  );
}
