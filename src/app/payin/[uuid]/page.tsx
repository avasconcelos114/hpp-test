import { GetServerSidePropsContext } from 'next';
import { string, object } from 'yup';

// API
import * as transactionApi from '@/api/transactions';

// Components
import { Card } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';

export default function AcceptQuotePage() {
  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <Card className='w-[460px]'></Card>
    </div>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const paramsSchema = object({
    uuid: string().uuid().required(),
  });

  try {
    const params = await paramsSchema.validate(context.params);
    const response = await transactionApi.getTransactionSummary(params.uuid);

    return {
      props: {
        transaction: response.data,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};
