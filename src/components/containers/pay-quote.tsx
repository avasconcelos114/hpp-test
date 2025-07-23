'use client';
import QRCode from 'react-qr-code';
import { redirect } from 'next/navigation';

import { ErrorCard } from '@/components/containers/error-card';
import { Card } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { useTransactionSummary } from '@/lib/queries';
import { SUPPORTED_CURRENCIES_MAP } from '@/lib/constants';
import { shortenAddress } from '@/lib/utils';
import { useTimer } from '@/hooks/useTimer';
import { CopyButton } from '../copy-button';

export function PayQuoteComponent({ uuid }: { uuid: string }) {
  const { data: transaction } = useTransactionSummary(uuid);
  console.log(transaction);
  const { formattedTimeUntilExpiry, isExpired } = useTimer(
    transaction?.expiryDate ?? null,
  );

  if (isExpired) {
    redirect(`/payin/${uuid}/expired`);
  }

  // The user connected directly without accepting a quote they will see an error
  if (!transaction || transaction?.quoteStatus !== 'ACCEPTED') {
    return (
      <div className='flex h-screen w-screen items-center justify-center'>
        <ErrorCard
          title='Invalid transaction'
          description='The transaction you are trying to access is invalid.\nPlease create a new one and try again.'
        />
      </div>
    );
  }

  function generateAmountDue() {
    return (
      <div className='flex flex-row items-center gap-4'>
        <Typography size='sm' weight='medium'>
          {transaction?.paidCurrency?.amount}{' '}
          {transaction?.paidCurrency?.currency}
        </Typography>
        <CopyButton
          text={transaction?.paidCurrency?.amount?.toString() ?? ''}
        />
      </div>
    );
  }

  function generateAddress() {
    return (
      <div className='flex flex-row items-center gap-4'>
        <Typography size='sm' weight='medium'>
          {shortenAddress(transaction?.address?.address ?? '')}
        </Typography>
        <CopyButton text={transaction?.address?.address ?? ''} />
      </div>
    );
  }

  function generateTimeLeftToPay() {
    return (
      <Typography size='sm' weight='medium'>
        {formattedTimeUntilExpiry}
      </Typography>
    );
  }

  return (
    <Card className='w-[460px]'>
      {transaction?.paidCurrency?.currency && (
        <div className='flex flex-col items-center gap-[25px]'>
          <Typography size='lg' weight='medium'>
            Pay with{' '}
            {SUPPORTED_CURRENCIES_MAP[transaction?.paidCurrency?.currency]}
          </Typography>

          <Typography
            size='sm'
            weight='regular'
            className='text-grays-text text-center'
          >
            To complete this payment send the amount
            <br /> due to the{' '}
            {SUPPORTED_CURRENCIES_MAP[transaction?.paidCurrency?.currency]}{' '}
            address provided below.
          </Typography>
        </div>
      )}
      <div className='flex w-full flex-col gap-2'>
        <hr className='border-grays-line-gray my-2 w-full' />
        <div className='flex flex-row items-center justify-between'>
          <Typography size='sm' weight='regular' className='text-grays-text'>
            Amount due
          </Typography>
          {generateAmountDue()}
        </div>
        <hr className='border-grays-line-gray my-2 w-full' />
        <div className='flex flex-row items-center justify-between'>
          <Typography size='sm' weight='regular' className='text-grays-text'>
            {transaction?.paidCurrency?.currency} address
          </Typography>
          {generateAddress()}
        </div>
        {transaction?.address?.address && (
          <div className='flex flex-col items-center justify-between gap-4 pt-[12px]'>
            <QRCode value={transaction?.address?.uri ?? ''} size={140} />
            <Typography
              size='xs'
              weight='regular'
              className='text-grays-text text-center'
            >
              {transaction?.address?.address}
            </Typography>
          </div>
        )}
        <hr className='border-grays-line-gray my-2 w-full' />
        <div className='flex flex-row items-center justify-between'>
          <Typography size='sm' weight='regular' className='text-grays-text'>
            Time left to pay
          </Typography>
          {generateTimeLeftToPay()}
        </div>
        <hr className='border-grays-line-gray my-2 w-full' />
      </div>
    </Card>
  );
}
