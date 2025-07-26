import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, vi } from 'vitest';
import { ErrorCard } from './error-card';

vi.mock('next/image', () => ({
  default: () => <div data-testid='icon'>icon</div>,
}));
// vi.mock('window', () => ({
//   location: {
//     reload: vi.fn(),
//   },
// }));

describe('ErrorCard', () => {
  it('should render with title and description', () => {
    render(<ErrorCard title='Error' description='Error description' />);

    expect(screen.getByText('Error')).toBeDefined();
    expect(screen.getByText('Error description')).toBeDefined();
  });

  it('should render with title and description and show refresh button', () => {
    render(
      <ErrorCard
        title='Error'
        description='Error description'
        showRefreshButton
      />,
    );

    expect(screen.getByText('Error')).toBeDefined();
    expect(screen.getByText('Error description')).toBeDefined();
    expect(screen.getByText('Refresh')).toBeDefined();
  });

  it('should call refresh when refresh button is clicked', () => {
    const reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: {
        reload: reloadSpy,
      },
      writable: true,
    });
    render(
      <ErrorCard
        title='Error'
        description='Error description'
        showRefreshButton
      />,
    );

    fireEvent.click(screen.getByTestId('refresh-button'));
    expect(reloadSpy).toHaveBeenCalled();
  });
});
