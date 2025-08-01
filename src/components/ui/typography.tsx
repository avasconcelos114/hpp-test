import React, { PropsWithChildren, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type TypographySize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TypographyWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type TypographyTag =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'label';

interface TypographyProps {
  size: TypographySize;
  tag?: TypographyTag;
  weight: TypographyWeight;
  children?: ReactNode;
  className?: string;
  htmlFor?: string;
  id?: string;
  role?: string;
  tabIndex?: number;
  ariaLabel?: string;
}

const sizeStyles: Record<TypographySize, string> = {
  xs: 'text-xs leading-[16px]',
  sm: 'text-sm leading-[22px]',
  md: 'text-base leading-[22px]',
  lg: 'text-lg leading-[28px]',
  xl: 'text-xl leading-[40px]',
};

const weightStyles: Record<TypographyWeight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export const Typography = ({
  size,
  tag = 'p',
  weight,
  children,
  className = '',
  htmlFor,
  id,
  ariaLabel,
  ...props
}: PropsWithChildren<TypographyProps>) => {
  const Component = tag;
  const sizeClassName = sizeStyles[size];
  const weightClassName = weightStyles[weight];

  return (
    <Component
      className={cn(
        'text-grays-not-quite-black m-0',
        sizeClassName,
        weightClassName,
        className,
      )}
      htmlFor={htmlFor}
      id={id}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </Component>
  );
};
