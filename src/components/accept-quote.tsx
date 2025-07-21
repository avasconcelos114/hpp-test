import { Card } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { useTransactionSummary } from '@/lib/queries';

type Props = {
  uuid: string;
};

export function AcceptQuoteComponent({ uuid }: Props) {
  const { data: transaction } = useTransactionSummary(uuid);
  console.log(transaction);
  return (
    <Card className='w-[460px]'>
      <Typography size='xl' weight='semibold'>
        BVNK Test
      </Typography>
    </Card>
  );
}
