import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect } from 'vitest';
import Page from './page';

describe('Root Page', () => {
  it('should render the page', () => {
    render(<Page />);
    expect(screen.getByText('BVNK Test')).toBeDefined();
  });
});
