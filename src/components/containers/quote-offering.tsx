import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

// Components
import { Typography } from '@/components/ui/typography';
import { HorizontalDivisor } from '@/components/ui/horizontal-divisor';

// Utils
import { TransactionSummary } from '@/lib/schemas/transaction';

// Hooks
import { useTimer } from '@/hooks/useTimer';

type QuoteOfferingComponentProps = {
  transaction?: TransactionSummary;
  refreshQuote: () => void;
  isLoading: boolean;
};

export function QuoteOfferingComponent({
  transaction,
  refreshQuote,
  isLoading,
}: QuoteOfferingComponentProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { isExpired, formattedTimeUntilExpiry } = useTimer(
    // META: What is the difference between acceptanceExpiryDate and quoteExpiryDate?
    // Is one just a legacy value kept by the API?
    transaction?.acceptanceExpiryDate ?? null,
  );

  useEffect(() => {
    // Resolving hydration issues related to the timer
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isExpired && transaction?.acceptanceExpiryDate) {
      refreshQuote();
    }
  }, [isExpired, transaction?.acceptanceExpiryDate, refreshQuote]);

  function generateAmountDue() {
    if (isLoading || !transaction) {
      return <Loader2 className='text-bvnk-primary animate-spin' size={18} />;
    }

    return (
      <Typography size='sm' weight='medium'>
        {transaction?.paidCurrency?.amount}{' '}
        {transaction?.paidCurrency?.currency}
      </Typography>
    );
  }

  function generateTimeUntilExpiry() {
    if (isLoading || !transaction?.acceptanceExpiryDate || !isMounted) {
      return <Loader2 className='text-bvnk-primary animate-spin' size={18} />;
    }

    return (
      <Typography
        size='sm'
        weight='regular'
        className='text-grays-text'
        data-testid='time-until-expiry'
      >
        {formattedTimeUntilExpiry}
      </Typography>
    );
  }

  return (
    <div className='flex w-full flex-col'>
      <HorizontalDivisor />
      <div
        className='flex flex-row items-center justify-between py-[12px]'
        data-testid='amount-due'
        role='group'
        tabIndex={0}
        aria-label={`Amount due: ${transaction?.paidCurrency?.amount} ${transaction?.paidCurrency?.currency}`}
      >
        <Typography size='sm' weight='regular' className='text-grays-text'>
          Amount due
        </Typography>
        {generateAmountDue()}
      </div>
      <HorizontalDivisor />
      <div
        className='flex flex-row items-center justify-between py-[12px]'
        role='group'
        tabIndex={0}
        aria-label={`Quoted price expires in: ${formattedTimeUntilExpiry}`}
      >
        <Typography size='sm' weight='regular' className='text-grays-text'>
          Quoted price expires in
        </Typography>
        {generateTimeUntilExpiry()}
      </div>
      <HorizontalDivisor />
    </div>
  );
}
