import { redirect } from 'next/navigation';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import * as transactionApi from '@/api/transactions';
import { TRANSACTION_SUMMARY_QUERY_KEY } from '@/lib/queries';

import { Card } from '@/components/ui/card';
import { PayQuoteComponent } from '@/components/containers/pay-quote';
import { payInPageSchema } from '@/lib/schemas/pages';

export default async function PayQuotePage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  try {
    await payInPageSchema.validate({ uuid });
  } catch {
    redirect(`/payin/${uuid}/invalid`);
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [TRANSACTION_SUMMARY_QUERY_KEY, uuid],
    queryFn: () => transactionApi.getTransactionSummary(uuid),
  });

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PayQuoteComponent uuid={uuid} />
      </HydrationBoundary>
    </div>
  );
}
