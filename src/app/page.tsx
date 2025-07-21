import { Card } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';

export default function HomePage() {
  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <Card className='w-[460px]'>
        <Typography size='xl' weight='semibold'>
          BVNK Test
        </Typography>
        <Typography size='md' weight='regular' className='text-grays-text'>
          Please generate a transaction and paste the UUID generated to the
          following URL to begin the payment process:{' '}
          <code className='bg-grays-line-gray rounded-md px-1 py-0.5 font-mono text-sm'>
            /payin/&#123;uuid&#125;
          </code>
        </Typography>
      </Card>
    </div>
  );
}
