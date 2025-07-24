import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HorizontalDivisor } from './horizontal-divisor';

describe('HorizontalDivisor', () => {
  it('should render the horizontal divisor', () => {
    render(<HorizontalDivisor />);
    expect(screen.getByTestId('horizontal-divisor')).toMatchSnapshot();
  });
});
