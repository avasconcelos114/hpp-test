import React from 'react';
import { vi, describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QuoteOfferingComponent } from '@/components/containers/quote-offering';
import { TransactionSummary } from '@/lib/schemas/transaction';

// Mock Loader2 and HorizontalDivisor for simplicity
vi.mock('lucide-react', () => ({
  Loader2: (props: Record<string, unknown>) => (
    <div data-testid='loader' {...props} />
  ),
}));
vi.mock('@/components/ui/horizontal-divisor', () => ({
  HorizontalDivisor: () => <div data-testid='horizontal-divisor' />,
}));

// Default mock for useTimer
vi.mock('@/hooks/useTimer', () => ({
  useTimer: () => ({
    isExpired: false,
    formattedTimeUntilExpiry: '09:59',
  }),
}));

describe('QuoteOfferingComponent', () => {
  const mockTransaction: TransactionSummary = {
    paidCurrency: { amount: 1.23, currency: 'BTC', actual: 1.23 },
    acceptanceExpiryDate: Date.now() + 1000 * 60 * 10,
    twoStep: false,
    pegged: false,
    customerId: 'customer-123',
    networkFeeBilledTo: 'MERCHANT',
    type: 'IN',
    status: 'PENDING',
    uuid: 'uuid-123',
    merchantDisplayName: 'Merchant',
    displayCurrency: { amount: 1.23, currency: 'BTC', actual: 1.23 },
    reference: 'REF123',
    quoteStatus: 'PENDING',
    address: { address: 'address', uri: 'uri', protocol: 'BTC' },
    expiryDate: Date.now() + 1000 * 60 * 10,
    walletId: 'wallet-123',
    merchantId: 'merchant-123',
    dateCreated: Date.now(),
    walletCurrency: { amount: 1.23, currency: 'BTC', actual: 1.23 },
    feeCurrency: { amount: 1.23, currency: 'BTC', actual: 1.23 },
    networkFeeCurrency: { amount: 1.23, currency: 'BTC', actual: 1.23 },
    displayRate: { base: 'BTC', counter: 'EUR', rate: 1.23 },
    exchangeRate: { base: 'BTC', counter: 'EUR', rate: 1.23 },
    returnUrl: 'https://example.com',
    redirectUrl: 'https://example.com',
    transactions: [],
    refund: null,
    refunds: [],
    currencyOptions: [
      {
        code: 'BTC',
        protocols: ['BTC'],
      },
    ],
    quoteExpiryDate: Date.now() + 1000 * 60 * 10,
    subType: 'merchantPayIn',
  };

  it('renders loader when loading', () => {
    render(
      <QuoteOfferingComponent
        transaction={mockTransaction}
        refreshQuote={vi.fn()}
        isLoading={true}
      />,
    );
    expect(screen.getAllByTestId('loader').length).toBeGreaterThan(0);
  });

  it('renders amount and expiry time when not loading', () => {
    render(
      <QuoteOfferingComponent
        transaction={mockTransaction}
        refreshQuote={vi.fn()}
        isLoading={false}
      />,
    );
    expect(screen.getByTestId('amount-due').textContent).toContain('1.23 BTC');
    expect(screen.getByTestId('time-until-expiry').textContent).toBe('09:59');
  });

  it('renders loader if transaction is missing', () => {
    render(
      <QuoteOfferingComponent
        transaction={undefined}
        refreshQuote={vi.fn()}
        isLoading={false}
      />,
    );
    expect(screen.getAllByTestId('loader').length).toBeGreaterThan(0);
  });

  it('calls refreshQuote when expired', async () => {
    vi.resetModules(); // Clear module cache
    vi.doMock('@/hooks/useTimer', () => ({
      useTimer: () => ({
        isExpired: true,
        formattedTimeUntilExpiry: '00:00',
      }),
    }));
    const refreshQuote = vi.fn();
    const { QuoteOfferingComponent: QuoteOfferingComponentWithExpired } =
      await import('@/components/containers/quote-offering');
    render(
      <QuoteOfferingComponentWithExpired
        transaction={{
          ...mockTransaction,
          acceptanceExpiryDate: Date.now() + 1000 * 60 * 10,
        }}
        refreshQuote={refreshQuote}
        isLoading={false}
      />,
    );
    await waitFor(() => {
      expect(refreshQuote).toHaveBeenCalled();
    });
  });
});
