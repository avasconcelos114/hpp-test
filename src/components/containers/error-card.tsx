import React, { useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';

import { Card } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';

type Props = {
  title: string;
  description: string;
};

export function ErrorCard({ title, description }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const formattedDescription = useMemo(
    () =>
      description?.split('\\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      )),
    [description],
  );

  useEffect(() => {
    cardRef.current?.focus();
  }, []);

  return (
    <Card
      ref={cardRef}
      className='w-[460px] p-[60px]'
      role='group'
      tabIndex={0}
      aria-label={`Error card`}
    >
      <div className='flex flex-col items-center gap-[20px]'>
        <Image
          src='/icons/error_card_icon.svg'
          alt='Error icon'
          width={48}
          height={48}
          className='text-status-error'
        />
        <Typography size='lg' weight='semibold' tabIndex={0}>
          {title}
        </Typography>
        <Typography
          size='md'
          weight='regular'
          className='text-grays-text text-center'
          tabIndex={0}
        >
          {formattedDescription}
        </Typography>
      </div>
    </Card>
  );
}
