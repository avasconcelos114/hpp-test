'use client';
import { ErrorCard } from '@/components/containers/error-card';
import { useTransactionSummary } from '@/lib/queries';
import { redirect, useParams } from 'next/navigation';

export default function ExpiredQuotePage() {
  const { uuid } = useParams();

  const { data: transaction } = useTransactionSummary(uuid as string);

  // Return user to main flow if the transaction is not actually expired
  if (transaction?.status !== 'EXPIRED') {
    redirect(`/payin/${uuid}`);
  }

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <ErrorCard
        title='Payment details expired'
        description='The payment details for your transaction\nhave expired.'
      />
    </div>
  );
}
