import { Card } from '@/components/ui/card_test';
import Typography from '@/components/ui/typography_test';
import { Button } from '@/components/ui/button';

export default function AcceptQuotePage() {
  return (
    <div className='w-[460px]'>
      <Card>
        <Typography size='xl' weight='semibold'>
          BVNK Test
        </Typography>
        <Typography size='md' weight='regular'>
          Please click on the button below to begin the payment process.
        </Typography>
        <Button>Begin Payment</Button>
      </Card>
    </div>
  );
}
