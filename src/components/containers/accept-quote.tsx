'use client';
import { Card } from '@/components/ui/card';
import { ErrorCard } from '@/components/containers/error-card';
import { Typography } from '@/components/ui/typography';
import { useTransactionSummary } from '@/lib/queries';

type Props = {
  uuid: string;
};

export function AcceptQuoteComponent({ uuid }: Props) {
  const { data: transaction, isError } = useTransactionSummary(uuid);

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
      <div className='flex flex-col items-center gap-2'>
        <Typography size='lg' weight='medium'>
          {transaction?.merchantDisplayName}
        </Typography>

        <div className='flex flex-row gap-2'>
          <Typography size='xl' weight='semibold'>
            {transaction?.displayCurrency.amount}
          </Typography>
          <Typography size='lg' weight='semibold'>
            {transaction?.displayCurrency.currency}
          </Typography>
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
      </div>
    </Card>
  );
}
