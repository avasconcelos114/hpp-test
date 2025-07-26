import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';

import { Card } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { Button } from '../ui/button';

type Props = {
  title: string;
  description: string;
  showRefreshButton?: boolean;
};

export function ErrorCard({
  title,
  description,
  showRefreshButton = false,
}: Props) {
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

  const ariaLabel = useMemo(
    () => `${title} - ${description?.replaceAll('\\n', ' ')}`,
    [title, description],
  );

  useEffect(() => {
    cardRef.current?.focus();
  }, []);

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <Card ref={cardRef} className='w-[460px] p-[60px]'>
      <div
        className='flex flex-col items-center gap-[20px]'
        role='group'
        tabIndex={0}
        aria-label={ariaLabel}
      >
        <Image
          src='/icons/error_card_icon.svg'
          alt='Error icon'
          width={48}
          height={48}
          className='text-status-error'
        />
        <Typography
          size='lg'
          weight='semibold'
          aria-hidden='true'
          role='presentation'
        >
          {title}
        </Typography>
        <Typography
          size='md'
          weight='regular'
          className='text-grays-text text-center'
          aria-hidden='true'
          role='presentation'
        >
          {formattedDescription}
        </Typography>
      </div>
      {showRefreshButton && (
        <Button size='sm' className='w-full' onClick={handleRefresh}>
          Refresh
        </Button>
      )}
    </Card>
  );
}
