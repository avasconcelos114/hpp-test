import React from 'react';
import { vi, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { AxiosError } from 'axios';
import { redirect } from 'next/navigation';

// Components
import { AcceptQuoteComponent } from './accept-quote';

// Utils
import { TransactionError } from '@/lib/schemas/transaction';
import { API_ERROR_MESSAGES } from '@/lib/constants';

// Mock hooks and atoms
vi.mock('@/lib/queries', () => ({
  useTransactionSummary: vi.fn(),
  useUpdateTransactionSummary: vi.fn(),
  useConfirmQuote: vi.fn(),
}));
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));
vi.mock('jotai', () => ({
  useAtom: () => [[{ code: 'BTC', name: 'Bitcoin' }]],
  atom: vi.fn(),
}));

describe('AcceptQuoteComponent - initial load', () => {
  const mockTransaction = {
    merchantDisplayName: 'Test Merchant',
    displayCurrency: { amount: '100', currency: 'USD' },
    reference: 'REF123',
    currencyOptions: [{ code: 'BTC' }],
    status: 'PENDING',
    quoteStatus: 'PENDING',
    paidCurrency: null,
  };

  beforeEach(async () => {
    const {
      useTransactionSummary,
      useUpdateTransactionSummary,
      useConfirmQuote,
    } = await import('@/lib/queries');
    (useTransactionSummary as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockTransaction,
      error: null,
    });
    (useUpdateTransactionSummary as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: vi.fn(),
      data: null,
      error: null,
      isPending: false,
    });
    (useConfirmQuote as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isSuccess: false,
    });
  });

  it('renders merchant name, amount, and reference on initial load', () => {
    render(<AcceptQuoteComponent uuid='uuid-123' />);
    expect(screen.getByText('Test Merchant')).toBeDefined();
    expect(screen.getByText('100')).toBeDefined();
    expect(screen.getByText('USD')).toBeDefined();
    expect(screen.getByText('REF123')).toBeDefined();
    expect(screen.getByLabelText('Select payment method')).toBeDefined();
  });

  it('should render the error card when there is an error', async () => {
    const { useTransactionSummary } = await import('@/lib/queries');
    // Create a mock AxiosError with a response.data containing the error object
    const errorObj: TransactionError = {
      code: 'MER-PAY-2017',
      message: 'Error',
      status: '400',
      requestId: '123',
      documentLink: null,
    };
    const axiosError = {
      isAxiosError: true,
      response: { data: errorObj },
    } as Partial<AxiosError> as AxiosError;

    (useTransactionSummary as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      error: axiosError,
    });

    render(<AcceptQuoteComponent uuid='uuid-123' />);
    expect(screen.getByText('Error')).toBeDefined();
    expect(screen.getByText(API_ERROR_MESSAGES[errorObj.code])).toBeDefined();
  });

  it('should redirect to the expired page if the transaction is expired', async () => {
    const { useTransactionSummary } = await import('@/lib/queries');
    (useTransactionSummary as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { ...mockTransaction, status: 'EXPIRED' },
      error: null,
    });

    render(<AcceptQuoteComponent uuid='uuid-123' />);
    expect(redirect).toHaveBeenCalledWith('/payin/uuid-123/expired');
  });

  it('should redirect to the pay page if the transaction is accepted', async () => {
    const { useTransactionSummary } = await import('@/lib/queries');
    (useTransactionSummary as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { ...mockTransaction, quoteStatus: 'ACCEPTED' },
      error: null,
    });

    render(<AcceptQuoteComponent uuid='uuid-123' />);
    expect(redirect).toHaveBeenCalledWith('/payin/uuid-123/pay');
  });

  it('should select a payment method', () => {
    render(<AcceptQuoteComponent uuid='uuid-123' />);
    const paymentMethod = screen.getByTestId('pay-with-select');
    fireEvent.change(paymentMethod, { target: { value: 'BTC' } });
    expect(screen.getByText('Bitcoin')).toBeDefined();
  });

  it('should redirect to the pay page if the transaction is paid', async () => {
    const {
      useTransactionSummary,
      useConfirmQuote,
      useUpdateTransactionSummary,
    } = await import('@/lib/queries');
    (useTransactionSummary as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { ...mockTransaction, paidCurrency: { currency: 'BTC' } },
      error: null,
    });
    (useConfirmQuote as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isSuccess: true,
    });
    (useUpdateTransactionSummary as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isSuccess: true,
    });

    render(<AcceptQuoteComponent uuid='uuid-123' />);
    // Select the payment method
    const paymentMethod = screen.getByTestId('pay-with-select');
    fireEvent.change(paymentMethod, { target: { value: 'BTC' } });

    // Confirm quote
    fireEvent.click(screen.getByTestId('confirm-quote-button'));
    expect(redirect).toHaveBeenCalledWith('/payin/uuid-123/pay');
  });
});
