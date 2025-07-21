import { Card } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';

export default function ExpiredQuotePage() {
  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <Card className='w-[460px]'>
        <Typography size='lg' weight='medium'>
          Merchant Name
        </Typography>
        <Typography size='xl' weight='semibold'>
          200
        </Typography>
        <Typography size='lg' weight='semibold'>
          EUR
        </Typography>
      </Card>
    </div>
  );
}
