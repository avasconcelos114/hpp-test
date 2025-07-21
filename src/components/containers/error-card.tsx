import React, { useMemo } from 'react';
import Image from 'next/image';

import { Card } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';

type Props = {
  title: string;
  description: string;
};

export function ErrorCard({ title, description }: Props) {
  const formattedDescription = useMemo(
    () =>
      description.split('\\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      )),
    [description],
  );

  return (
    <Card className='w-[460px] p-[60px]'>
      <div className='flex flex-col items-center gap-[20px]'>
        <Image
          src='/icons/error_card_icon.svg'
          alt='Error icon'
          width={48}
          height={48}
          className='text-status-error'
        />
        <Typography size='lg' weight='semibold'>
          {title}
        </Typography>
        <Typography
          size='md'
          weight='regular'
          className='text-grays-text text-center'
        >
          {formattedDescription}
        </Typography>
      </div>
    </Card>
  );
}
