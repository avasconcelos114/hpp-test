import { redirect } from 'next/navigation';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

// API
import * as transactionApi from '@/api/transactions';

// Components
import { AcceptQuoteComponent } from '@/components/containers/accept-quote';

// Utils
import { payInPageSchema } from '@/lib/schemas/pages';
import { TRANSACTION_SUMMARY_QUERY_KEY } from '@/lib/queries';

export default async function AcceptQuotePage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  // Validating UUID server-side to avoid hydration errors
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
        <AcceptQuoteComponent uuid={uuid} />
      </HydrationBoundary>
    </div>
  );
}
