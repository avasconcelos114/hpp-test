import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './card';

describe('Card', () => {
  it('should render the card', () => {
    render(<Card>Card contents</Card>);
    expect(screen.getByText('Card contents')).toBeDefined();
    expect(screen.getByTestId('card')).toMatchSnapshot();
  });
});
