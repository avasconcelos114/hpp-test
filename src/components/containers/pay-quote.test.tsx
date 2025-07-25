import React from 'react';
import { vi, expect, describe, it, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { redirect } from 'next/navigation';

// Mock hooks and atoms
vi.mock('@/lib/queries', () => ({
  useTransactionSummary: vi.fn(),
}));
vi.mock('jotai', () => ({
  useAtom: () => [[{ code: 'BTC', name: 'Bitcoin' }]],
  atom: vi.fn(),
}));
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));
vi.mock('react-qr-code', () => ({
  __esModule: true,
  default: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid='qr-code' {...props} />
  ),
}));
vi.mock('@/hooks/useTimer', () => ({
  useTimer: vi.fn().mockReturnValue({
    formattedTimeUntilExpiry: '10:00:00',
    isExpired: false,
  }),
}));

describe('PayQuoteComponent', () => {
  const mockTransaction = {
    paidCurrency: { amount: '0.5', currency: 'BTC' },
    address: {
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      uri: 'bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    },
    quoteStatus: 'ACCEPTED',
    expiryDate: Date.now() + 1000 * 60 * 10,
  };

  beforeEach(async () => {
    const { useTransactionSummary } = await import('@/lib/queries');
    (useTransactionSummary as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockTransaction,
    });
  });

  it('renders pay quote details on initial load', async () => {
    const { PayQuoteComponent } = await import(
      '@/components/containers/pay-quote'
    );
    render(<PayQuoteComponent uuid='uuid-123' />);
    expect(screen.getByText('Pay with Bitcoin')).toBeDefined();
    expect(screen.getByText('Amount due')).toBeDefined();
    expect(screen.getByText('0.5 BTC')).toBeDefined();
    expect(screen.getByText('BTC address')).toBeDefined();
    expect(
      screen.getByText('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'),
    ).toBeDefined();
    expect(screen.getByTestId('qr-code')).toBeDefined();
    expect(screen.getByText('Time left to pay')).toBeDefined();
    expect(screen.getByText('10:00:00')).toBeDefined();
  });

  it('renders error card if transaction is missing or not accepted', async () => {
    const { useTransactionSummary } = await import('@/lib/queries');
    (useTransactionSummary as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
    });
    const { PayQuoteComponent } = await import(
      '@/components/containers/pay-quote'
    );
    render(<PayQuoteComponent uuid='uuid-123' />);
    expect(screen.getByText('Invalid transaction')).toBeDefined();
    expect(
      screen.getByText(/The transaction you are trying to access is invalid/i),
    ).toBeDefined();
  });

  it('redirects to expired page if timer is expired', async () => {
    const { useTransactionSummary } = await import('@/lib/queries');
    const { useTimer } = await import('@/hooks/useTimer');

    (redirect as unknown as ReturnType<typeof vi.fn>).mockClear();
    (useTransactionSummary as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { ...mockTransaction, expiryDate: Date.now() - 1000 * 60 * 10 },
      error: null,
    });

    (useTimer as ReturnType<typeof vi.fn>).mockReturnValue({
      formattedTimeUntilExpiry: '00:00:00',
      isExpired: true,
    });

    const { PayQuoteComponent: PayQuoteComponentWithExpired } = await import(
      '@/components/containers/pay-quote'
    );
    render(<PayQuoteComponentWithExpired uuid='uuid-123' />);

    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith('/payin/uuid-123/expired');
    });
  });
});
