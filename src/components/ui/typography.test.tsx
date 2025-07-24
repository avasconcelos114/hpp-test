import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Typography } from './typography';

describe('Typography', () => {
  it('should render the typography', () => {
    render(
      <Typography size='sm' weight='regular'>
        Typography
      </Typography>,
    );
    expect(screen.getByText('Typography')).toMatchSnapshot();
  });

  it('should render the typography with the correct size', () => {
    render(
      <Typography size='sm' weight='regular'>
        Typography
      </Typography>,
    );
    const typography = screen.getByText('Typography');
    expect(typography.classList).toContain('text-[14px]');
  });

  it('should render the typography with the correct weight', () => {
    render(
      <Typography size='sm' weight='medium'>
        Typography
      </Typography>,
    );
    const typography = screen.getByText('Typography');
    expect(typography.classList).toContain('font-medium');
  });

  it('should render the typography with the correct color', () => {
    render(
      <Typography size='sm' weight='regular'>
        Typography
      </Typography>,
    );
    const typography = screen.getByText('Typography');
    expect(typography.classList).toContain('text-grays-not-quite-black');
  });

  it('should render the typography with the correct class name', () => {
    render(
      <Typography size='sm' weight='regular' className='text-red-500'>
        Typography
      </Typography>,
    );
    const typography = screen.getByText('Typography');
    expect(typography.classList).toContain('text-red-500');
  });
});
