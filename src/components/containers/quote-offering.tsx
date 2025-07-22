import { useState } from 'react';
import { Typography } from '../ui/typography';
import { useRefreshQuote } from '@/lib/queries';

type QuoteOfferingComponentProps = {
  uuid: string;
  initialExpiresIn: number;
};

export function QuoteOfferingComponent({
  uuid,
  initialExpiresIn,
}: QuoteOfferingComponentProps) {
  const [expiresIn, setExpiresIn] = useState(initialExpiresIn);
  const { data: quote, isLoading } = useRefreshQuote(uuid, true, expiresIn);

  function generateAmountDue() {
    if (!quote?.a)
      return (
        <div className='flex flex-row items-center justify-between'>
          <Typography size='sm' weight='regular' className='text-grays-text'>
            Amount due
          </Typography>
        </div>
      );
  }
  return (
    <>
      <hr className='w-full' />
      <div className='flex flex-row items-center justify-between'>
        <Typography size='sm' weight='regular' className='text-grays-text'>
          Amount due
        </Typography>
      </div>
      <hr className='w-full' />
      <div className='flex flex-row items-center justify-between'>
        <Typography size='sm' weight='regular' className='text-grays-text'>
          Quoted price expires in
        </Typography>
      </div>
      <hr className='w-full' />
    </>
  );
}
