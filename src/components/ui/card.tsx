import * as React from 'react';

import { cn } from '@/lib/utils';

export function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card'
      className={cn(
        'text-card-foreground flex flex-col gap-6 rounded-xl bg-white p-[25px]',
        className,
      )}
      {...props}
    />
  );
}
