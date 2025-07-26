'use client';
import React, { useMemo } from 'react';

// Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ErrorCard } from '@/components/containers/error-card';
import { Select, SelectOption } from '@/components/ui/select';
import { Typography } from '@/components/ui/typography';
import { QuoteOfferingComponent } from '@/components/containers/quote-offering';

// Utils
import {
  ALLOW_REFRESH_QUOTE_ERROR_CODES,
  API_ERROR_MESSAGES,
} from '@/lib/constants';

// Hooks
import { useAcceptQuoteState } from '@/hooks/useAcceptQuoteState';

export function AcceptQuoteComponent({ uuid }: { uuid: string }) {
  const {
    transaction,
    error,
    isLoading,
    selectedPaymentMethod,
    supportedCurrencies,
    refreshQuote,
    handleSelectPaymentMethod,
    confirmQuote,
  } = useAcceptQuoteState(uuid);

  const paymentOptions: SelectOption[] = useMemo(() => {
    const currencyOptions = transaction?.currencyOptions;

    if (!currencyOptions) return [];

    const options: SelectOption[] = [];
    currencyOptions.forEach((currency) => {
      const currencyName = supportedCurrencies?.find(
        (c) => c.code === currency.code,
      )?.name;

      if (currencyName) {
        options.push({ value: currency.code, label: currencyName });
      }
    });

    return [{ value: 'none', label: 'Select Currency' }, ...options];
  }, [transaction, supportedCurrencies]);

  const hasSelectedPayment = useMemo(
    () => selectedPaymentMethod !== 'none',
    [selectedPaymentMethod],
  );

  async function handleConfirmQuote() {
    await confirmQuote();
  }

  if (error) {
    return (
      <ErrorCard
        title={error.message || 'Error'}
        description={API_ERROR_MESSAGES[error.code]}
        showRefreshButton={ALLOW_REFRESH_QUOTE_ERROR_CODES.includes(error.code)}
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

        {hasSelectedPayment && transaction && (
          <>
            <QuoteOfferingComponent
              transaction={transaction}
              refreshQuote={refreshQuote}
              isLoading={isLoading}
            />
            <Button
              onClick={handleConfirmQuote}
              disabled={isLoading}
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
