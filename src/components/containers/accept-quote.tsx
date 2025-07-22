'use client';
import { useState, useMemo } from 'react';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { ErrorCard } from '@/components/containers/error-card';
import { Typography } from '@/components/ui/typography';
import { useTransactionSummary } from '@/lib/queries';
import { Select } from '@/components/ui/select';

export function AcceptQuoteComponent({ uuid }: { uuid: string }) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('none');
  const { data: transaction, isError } = useTransactionSummary(uuid);

  const hasSelectedPayment = useMemo(
    () => selectedPaymentMethod !== 'none',
    [selectedPaymentMethod],
  );

  const paymentOptions = [
    { value: 'none', label: 'Select currency' },
    { value: 'BTC', label: 'Bitcoin' },
    { value: 'ETH', label: 'Ethereum' },
    { value: 'LTC', label: 'Litecoin' },
  ];

  if (transaction?.status === 'EXPIRED') {
    redirect(`/payin/${uuid}/expired`);
  }

  if (isError) {
    return (
      <ErrorCard
        title='Error'
        description='Something went wrong while fetching the transaction summary'
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
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            options={paymentOptions}
          />
        </div>

        {hasSelectedPayment && (
          <>
            <hr className='w-full' />
            <div className='flex flex-row items-center justify-between'>
              <Typography
                size='sm'
                weight='regular'
                className='text-grays-text'
              >
                Amount due
              </Typography>
            </div>
            <hr className='w-full' />
            <div className='flex flex-row items-center justify-between'>
              <Typography
                size='sm'
                weight='regular'
                className='text-grays-text'
              >
                Quoted price expires in
              </Typography>
            </div>
            <hr className='w-full' />
          </>
        )}
      </div>
    </Card>
  );
}
