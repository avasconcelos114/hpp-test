import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Typography } from '@/components/ui/typography';
import { TransactionSummary } from '@/lib/schemas/transaction';
import { useRef } from 'react';

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
  const [now, setNow] = useState(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setNow(Date.now()); // Reset timer on transaction change

    if (!transaction?.acceptanceExpiryDate) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const tick = () => {
      const timeLeft = transaction.acceptanceExpiryDate! - Date.now();
      if (timeLeft <= 0) {
        setNow(Number(transaction.acceptanceExpiryDate));
        if (intervalRef.current) clearInterval(intervalRef.current);
        refreshQuote();
      } else {
        setNow(Date.now());
      }
    };

    intervalRef.current = setInterval(tick, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [transaction?.acceptanceExpiryDate, isLoading]);

  function generateAmountDue() {
    if (isLoading || !transaction) {
      return <Loader2 className='text-bvnk-primary animate-spin' />;
    }

    return (
      <Typography size='sm' weight='medium'>
        {transaction.paidCurrency.amount} {transaction.paidCurrency.currency}
      </Typography>
    );
  }

  function generateTimeUntilExpiry() {
    if (isLoading || !transaction?.acceptanceExpiryDate) {
      return <Loader2 className='text-bvnk-primary animate-spin' />;
    }

    const timeUntilExpiry = transaction.acceptanceExpiryDate - now;
    const hours = Math.floor(timeUntilExpiry / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeUntilExpiry % (1000 * 60 * 60)) / (1000 * 60),
    );
    const seconds = Math.floor((timeUntilExpiry % (1000 * 60)) / 1000);
    const formattedTimeUntilExpiry = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return (
      <Typography size='sm' weight='regular' className='text-grays-text'>
        {formattedTimeUntilExpiry}
      </Typography>
    );
  }

  return (
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
          Quoted price expires in
        </Typography>
        {generateTimeUntilExpiry()}
      </div>
      <hr className='border-grays-line-gray my-2 w-full' />
    </div>
  );
}
