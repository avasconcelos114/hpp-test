import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Typography } from './typography';

export type SelectOption = {
  label: string;
  value: string;
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  labelId?: string;
  helperText?: string;
  containerClassName?: string;
  options: SelectOption[];
  ariaLabel?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      labelId,
      helperText,
      className,
      containerClassName,
      id,
      options,
      ariaLabel,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const describedBy = helperText ? `${selectId}-helper-text` : undefined;
    const labelHtmlId = labelId || `${selectId}-label`;

    return (
      <div className={cn('flex w-full flex-col gap-1', containerClassName)}>
        {label && (
          <Typography
            id={labelHtmlId}
            htmlFor={selectId}
            size='md'
            weight='medium'
            tag='label'
            className='text-sm font-medium'
            ariaLabel={ariaLabel}
          >
            {label}
          </Typography>
        )}
        <div className='relative w-full'>
          <select
            id={selectId}
            ref={ref}
            aria-labelledby={label ? labelHtmlId : undefined}
            aria-describedby={describedBy}
            className={cn(
              // Hide native arrow, add right padding for icon
              'border-grays-line-gray focus:ring-ring/50 focus:border-ring h-[56px] w-full appearance-none rounded-md border px-3 py-2 pr-10 text-sm focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              className,
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Image
            src='/icons/select_icon.svg'
            alt='Select dropdown icon'
            width={20}
            height={20}
            aria-hidden='true'
            className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2'
          />
        </div>
        {helperText && (
          <span id={describedBy} className={'text-muted-foreground text-xs'}>
            {helperText}
          </span>
        )}
      </div>
    );
  },
);
Select.displayName = 'Select';

export { Select };
