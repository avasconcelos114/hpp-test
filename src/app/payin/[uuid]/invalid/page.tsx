'use client';
import { ErrorCard } from '@/components/containers/error-card';

export default function ExpiredQuotePage() {
  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <ErrorCard
        title='Invalid transaction'
        description='The transaction you are trying to access is invalid.\nPlease create a new one and try again.'
      />
    </div>
  );
}
