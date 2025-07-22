import { ReactNode } from 'react';
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
  weight?: TypographyWeight;
  children?: ReactNode;
  className?: string;
  htmlFor?: string;
  id?: string;
}

const sizeStyles: Record<TypographySize, string> = {
  xs: 'text-[12px] leading-[16px]',
  sm: 'text-[14px] leading-[22px]',
  md: 'text-[15px] leading-[22px]',
  lg: 'text-[20px] leading-[28px]',
  xl: 'text-[32px] leading-[40px]',
};

const weightStyles: Record<TypographyWeight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export const Typography = ({
  size = 'md',
  tag = 'p',
  weight = 'regular',
  children,
  className = '',
  htmlFor,
  id,
}: TypographyProps) => {
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
    >
      {children}
    </Component>
  );
};
