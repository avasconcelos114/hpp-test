'use client';
import React, { useMemo } from 'react';
import QRCode from 'react-qr-code';

// Components
import { ErrorCard } from '@/components/containers/error-card';
import { Card } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { CopyButton } from '@/components/copy-button';
import { HorizontalDivisor } from '@/components/ui/horizontal-divisor';

// Utils
import { shortenAddress } from '@/lib/utils';

// Hooks
import { usePayQuoteState } from '@/hooks/usePayQuoteState';
import { useFocusOnNavigation } from '@/hooks/useFocusOnNavigation';

export function PayQuoteComponent({ uuid }: { uuid: string }) {
  useFocusOnNavigation();
  const {
    isMounted,
    formattedTimeUntilExpiry,
    transaction,
    supportedCurrencies,
  } = usePayQuoteState(uuid);

  const currencyName = useMemo(() => {
    return (
      supportedCurrencies?.find(
        (c) => c.code === transaction?.paidCurrency?.currency,
      )?.name || transaction?.paidCurrency?.currency
    );
  }, [transaction, supportedCurrencies]);

  const amountDueSection = useMemo(() => {
    return (
      <div className='flex flex-row items-center gap-4'>
        <Typography
          size='sm'
          weight='medium'
          aria-hidden='true'
          role='presentation'
        >
          {transaction?.paidCurrency?.amount}{' '}
          {transaction?.paidCurrency?.currency}
        </Typography>
        <CopyButton
          text={transaction?.paidCurrency?.amount?.toString() ?? ''}
          testId='amount-due'
          ariaLabel={`Copy amount due to clipboard`}
        />
      </div>
    );
  }, [transaction]);

  const timeLeftToPaySection = useMemo(() => {
    return (
      <Typography
        size='sm'
        weight='medium'
        aria-hidden='true'
        role='presentation'
      >
        {isMounted ? formattedTimeUntilExpiry : '00:00:00'}
      </Typography>
    );
  }, [formattedTimeUntilExpiry, isMounted]);

  const addressSection = useMemo(() => {
    return (
      <div className='flex flex-row items-center gap-4'>
        <Typography
          size='sm'
          weight='medium'
          aria-hidden='true'
          role='presentation'
        >
          {shortenAddress(transaction?.address?.address ?? '')}
        </Typography>
        <CopyButton
          text={transaction?.address?.address ?? ''}
          testId='address'
          ariaLabel={`Copy ${transaction?.paidCurrency?.currency} address to clipboard`}
        />
      </div>
    );
  }, [transaction]);

  // If the user connected directly without accepting a quote they will see an error
  if (!transaction) {
    return (
      <div className='flex h-screen w-screen items-center justify-center'>
        <ErrorCard
          title='Invalid transaction'
          description='The transaction you are trying to access is invalid.\nPlease create a new one and try again.'
        />
      </div>
    );
  }

  return (
    <Card className='w-[460px]'>
      {transaction?.paidCurrency?.currency && (
        <div
          className='flex flex-col items-center gap-[25px]'
          role='group'
          tabIndex={0}
          aria-label={`Pay with ${currencyName}`}
        >
          <Typography
            size='lg'
            weight='medium'
            aria-hidden='true'
            role='presentation'
          >
            Pay with {currencyName}
          </Typography>

          <div className='mx-[50px] flex flex-col items-center'>
            <Typography
              size='sm'
              weight='regular'
              className='text-grays-text text-center'
            >
              To complete this payment send the amount due to the {currencyName}{' '}
              address provided below.
            </Typography>
          </div>
        </div>
      )}
      <div className='flex w-full flex-col'>
        <HorizontalDivisor />
        <div
          className='flex flex-row items-center justify-between py-[12px]'
          role='group'
          tabIndex={0}
          aria-label={`Amount due: ${transaction?.paidCurrency?.amount} ${transaction?.paidCurrency?.currency}`}
        >
          <Typography
            size='sm'
            weight='regular'
            className='text-grays-text'
            aria-hidden='true'
            role='presentation'
          >
            Amount due
          </Typography>
          {amountDueSection}
        </div>
        <HorizontalDivisor />
        <div
          className='flex flex-row items-center justify-between py-[12px]'
          role='group'
          tabIndex={0}
          aria-label={`${transaction?.paidCurrency?.currency} address`}
        >
          <Typography
            size='sm'
            weight='regular'
            className='text-grays-text'
            aria-hidden='true'
            role='presentation'
          >
            {transaction?.paidCurrency?.currency} address
          </Typography>
          {addressSection}
        </div>
        {transaction?.address?.address && (
          <div className='flex flex-col items-center justify-between gap-[12px] py-[12px]'>
            <QRCode
              value={transaction?.address?.uri ?? ''}
              size={140}
              aria-label={`Scan this QR code to pay with ${transaction?.paidCurrency?.currency}`}
            />
            <Typography
              size='xs'
              weight='regular'
              className='text-grays-text text-center'
              aria-hidden='true'
              role='presentation'
            >
              {transaction?.address?.address}
            </Typography>
          </div>
        )}
        <HorizontalDivisor />
        <div
          className='flex flex-row items-center justify-between py-[12px]'
          role='group'
          tabIndex={0}
          aria-label={`Time left to pay: ${isMounted ? formattedTimeUntilExpiry : '00:00:00'}`}
        >
          <Typography
            size='sm'
            weight='regular'
            className='text-grays-text'
            aria-hidden='true'
            role='presentation'
          >
            Time left to pay
          </Typography>
          {timeLeftToPaySection}
        </div>
        <HorizontalDivisor />
      </div>
    </Card>
  );
}
