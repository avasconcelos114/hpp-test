import { redirect } from 'next/navigation';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import * as transactionApi from '@/api/transactions';
import { payInPageSchema } from '@/lib/schemas/pages';
import { AcceptQuoteComponent } from '@/components/accept-quote';
import { TRANSACTION_SUMMARY_QUERY_KEY } from '@/lib/queries';

export default async function AcceptQuotePage(props: {
  params: { uuid: string };
}) {
  // Validating UUID server-side to avoid hydration errors
  const params = await props.params;
  try {
    await payInPageSchema.validate(params);
  } catch {
    redirect('/404');
  }

  // Prefetching transaction server-side
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [TRANSACTION_SUMMARY_QUERY_KEY, params.uuid],
    queryFn: () => transactionApi.getTransactionSummary(params.uuid),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='flex h-screen w-screen items-center justify-center'>
        <AcceptQuoteComponent uuid={params.uuid} />
      </div>
    </HydrationBoundary>
  );
}
