import { ErrorCard } from '@/components/containers/error-card';

export default function ExpiredQuotePage() {
  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <ErrorCard
        title='Payment details expired'
        description='The payment details for your transaction\nhave expired.'
      />
    </div>
  );
}
