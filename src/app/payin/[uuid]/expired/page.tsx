'use client';
import { redirect, useParams } from 'next/navigation';

import { ErrorCard } from '@/components/containers/error-card';
import { useTransactionSummary } from '@/lib/queries';
import { useFocusOnNavigation } from '@/hooks/useFocusOnNavigation';

export default function ExpiredQuotePage() {
  const { uuid } = useParams();
  useFocusOnNavigation();
  const { data: transaction } = useTransactionSummary(uuid as string);

  // Return user to main flow if the transaction is not actually expired
  if (
    transaction?.expiryDate &&
    new Date(transaction.expiryDate) > new Date()
  ) {
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
