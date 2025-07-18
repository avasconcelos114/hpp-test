import Card from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';

export default function Home() {
  return (
    <div className='w-[460px]'>
      <Card>
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
