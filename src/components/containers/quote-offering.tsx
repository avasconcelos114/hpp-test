import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { HorizontalDivisor } from '@/components/ui/horizontal-divisor';
import { TransactionSummary } from '@/lib/schemas/transaction';
import { useTimer } from '@/hooks/useTimer';

type QuoteOfferingComponentProps = {
  transaction?: TransactionSummary;
  refreshQuote: () => void;
  confirmQuote: () => void;
  isLoading: boolean;
};

export function QuoteOfferingComponent({
  transaction,
  refreshQuote,
  confirmQuote,
  isLoading,
}: QuoteOfferingComponentProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { isExpired, formattedTimeUntilExpiry } = useTimer(
    // What is the difference between acceptanceExpiryDate and quoteExpiryDate?
    // Is one just a legacy value kept by the API?
    transaction?.acceptanceExpiryDate ?? null,
  );

  useEffect(() => {
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
      <Typography size='sm' weight='regular' className='text-grays-text'>
        {formattedTimeUntilExpiry}
      </Typography>
    );
  }

  return (
    <div className='flex w-full flex-col'>
      <HorizontalDivisor />
      <div className='flex flex-row items-center justify-between py-[12px]'>
        <Typography size='sm' weight='regular' className='text-grays-text'>
          Amount due
        </Typography>
        {generateAmountDue()}
      </div>
      <HorizontalDivisor />
      <div className='flex flex-row items-center justify-between py-[12px]'>
        <Typography size='sm' weight='regular' className='text-grays-text'>
          Quoted price expires in
        </Typography>
        {generateTimeUntilExpiry()}
      </div>
      <HorizontalDivisor />
    </div>
  );
}
