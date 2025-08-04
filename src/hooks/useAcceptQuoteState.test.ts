import { renderHook, act } from '@testing-library/react';
import { vi, expect, describe, it, beforeEach } from 'vitest';
import { redirect } from 'next/navigation';
import { useAtom } from 'jotai';
import { MOCK_TRANSACTION_SUMMARY } from '@/lib/tests/mock-data';

// Mock dependencies
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('jotai', () => ({
  useAtom: vi.fn(),
}));

vi.mock('@/store/currencies', () => ({
  supportedCurrenciesAtom: vi.fn(),
}));

describe('useAcceptQuoteState', () => {
  const mockUuid = 'test-uuid-123';
  const mockSupportedCurrencies = [
    { code: 'BTC', name: 'Bitcoin' },
    { code: 'ETH', name: 'Ethereum' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    (useAtom as ReturnType<typeof vi.fn>).mockReturnValue([
      mockSupportedCurrencies,
    ]);
  });

  describe('Initial State', () => {
    it('should initialize with default values', async () => {
      const mockTransactionSummary = {
        ...MOCK_TRANSACTION_SUMMARY,
        paidCurrency: null,
      };
      vi.resetModules();
      vi.doMock('@/lib/queries', () => ({
        useTransactionSummary: vi.fn().mockReturnValue({
          data: mockTransactionSummary,
          error: null,
          isPending: false,
        }),
        useUpdateTransactionSummary: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          data: null,
          error: null,
          isPending: false,
        }),
        useConfirmQuote: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          isPending: false,
          isSuccess: false,
          error: null,
        }),
      }));

      const { useAcceptQuoteState } = await import('./useAcceptQuoteState');
      const { result } = renderHook(() => useAcceptQuoteState(mockUuid));

      expect(result.current.transaction).toEqual(mockTransactionSummary);
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.selectedPaymentMethod).toBe('none');
      expect(result.current.supportedCurrencies).toEqual(
        mockSupportedCurrencies,
      );
    });

    it('should show loading state when initial transaction is pending', async () => {
      vi.resetModules();
      vi.doMock('@/lib/queries', () => ({
        useTransactionSummary: vi.fn().mockReturnValue({
          data: null,
          error: null,
          isLoading: true,
        }),
        useUpdateTransactionSummary: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          data: null,
          error: null,
          isPending: false,
        }),
        useConfirmQuote: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          isPending: false,
          isSuccess: false,
          error: null,
        }),
      }));

      const { useAcceptQuoteState } = await import('./useAcceptQuoteState');
      const { result } = renderHook(() => useAcceptQuoteState(mockUuid));
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('Payment Method Selection', () => {
    it('should update selected payment method and call update transaction', async () => {
      const mockMutate = vi.fn();

      vi.resetModules();
      vi.doMock('@/lib/queries', () => ({
        useTransactionSummary: vi.fn().mockReturnValue({
          data: MOCK_TRANSACTION_SUMMARY,
          error: null,
          isPending: false,
        }),
        useUpdateTransactionSummary: vi.fn().mockReturnValue({
          mutate: mockMutate,
          data: null,
          error: null,
          isPending: false,
        }),
        useConfirmQuote: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          isPending: false,
          isSuccess: false,
          error: null,
        }),
      }));

      const { useAcceptQuoteState } = await import('./useAcceptQuoteState');
      const { result } = renderHook(() => useAcceptQuoteState(mockUuid));

      act(() => {
        result.current.handleSelectPaymentMethod('BTC');
      });

      expect(result.current.selectedPaymentMethod).toBe('BTC');
      expect(mockMutate).toHaveBeenCalledWith({ currency: 'BTC' });
    });

    it('should not call update transaction when selecting "none"', async () => {
      const mockMutate = vi.fn();

      vi.resetModules();
      vi.doMock('@/lib/queries', () => ({
        useTransactionSummary: vi.fn().mockReturnValue({
          data: {
            ...MOCK_TRANSACTION_SUMMARY,
            paidCurrency: null,
          },
          error: null,
          isPending: false,
        }),
        useUpdateTransactionSummary: vi.fn().mockReturnValue({
          mutate: mockMutate,
          data: null,
          error: null,
          isPending: false,
        }),
        useConfirmQuote: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          isPending: false,
          isSuccess: false,
          error: null,
        }),
      }));

      const { useAcceptQuoteState } = await import('./useAcceptQuoteState');
      const { result } = renderHook(() => useAcceptQuoteState(mockUuid));

      act(() => {
        result.current.handleSelectPaymentMethod('none');
      });

      expect(result.current.selectedPaymentMethod).toBe('none');
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('should auto-select payment method if paidCurrency is set', async () => {
      const transactionWithPaidCurrency = {
        ...MOCK_TRANSACTION_SUMMARY,
        paidCurrency: { amount: 0.0025, currency: 'BTC', actual: 0.0025 },
      };

      const mockMutate = vi.fn();

      vi.resetModules();
      vi.doMock('@/lib/queries', () => ({
        useTransactionSummary: vi.fn().mockReturnValue({
          data: transactionWithPaidCurrency,
          error: null,
          isPending: false,
        }),
        useUpdateTransactionSummary: vi.fn().mockReturnValue({
          mutate: mockMutate,
          data: null,
          error: null,
          isPending: false,
        }),
        useConfirmQuote: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          isPending: false,
          isSuccess: false,
          error: null,
        }),
      }));

      const { useAcceptQuoteState } = await import('./useAcceptQuoteState');
      const { result } = renderHook(() => useAcceptQuoteState(mockUuid));

      expect(result.current.selectedPaymentMethod).toBe('BTC');
      expect(mockMutate).toHaveBeenCalledWith({ currency: 'BTC' });
    });
  });

  describe('Quote Refresh', () => {
    it('should call update transaction when refreshing quote with selected payment method', async () => {
      const mockMutate = vi.fn();

      vi.resetModules();
      vi.doMock('@/lib/queries', () => ({
        useTransactionSummary: vi.fn().mockReturnValue({
          data: MOCK_TRANSACTION_SUMMARY,
          error: null,
          isPending: false,
        }),
        useUpdateTransactionSummary: vi.fn().mockReturnValue({
          mutate: mockMutate,
          data: null,
          error: null,
          isPending: false,
        }),
        useConfirmQuote: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          isPending: false,
          isSuccess: false,
          error: null,
        }),
      }));

      const { useAcceptQuoteState } = await import('./useAcceptQuoteState');
      const { result } = renderHook(() => useAcceptQuoteState(mockUuid));

      // First select a payment method
      act(() => {
        result.current.handleSelectPaymentMethod('BTC');
      });

      // Reset the mock call count
      mockMutate.mockClear();

      // Then refresh quote
      act(() => {
        result.current.refreshQuote();
      });

      expect(mockMutate).toHaveBeenCalledWith({ currency: 'BTC' });
    });

    it('should not call update transaction when refreshing quote without selected payment method', async () => {
      const mockMutate = vi.fn();

      vi.resetModules();
      vi.doMock('@/lib/queries', () => ({
        useTransactionSummary: vi.fn().mockReturnValue({
          data: {
            ...MOCK_TRANSACTION_SUMMARY,
            paidCurrency: null,
          },
          error: null,
          isPending: false,
        }),
        useUpdateTransactionSummary: vi.fn().mockReturnValue({
          mutate: mockMutate,
          data: null,
          error: null,
          isPending: false,
        }),
        useConfirmQuote: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          isPending: false,
          isSuccess: false,
          error: null,
        }),
      }));

      const { useAcceptQuoteState } = await import('./useAcceptQuoteState');
      const { result } = renderHook(() => useAcceptQuoteState(mockUuid));

      act(() => {
        result.current.refreshQuote();
      });

      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should set error when update transaction fails', async () => {
      const mockError = { code: 'MER-PAY-2001', message: 'Invalid currency' };

      vi.resetModules();
      vi.doMock('@/lib/queries', () => ({
        useTransactionSummary: vi.fn().mockReturnValue({
          data: MOCK_TRANSACTION_SUMMARY,
          error: null,
          isPending: false,
        }),
        useUpdateTransactionSummary: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          data: null,
          error: mockError,
          isPending: false,
        }),
        useConfirmQuote: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          isPending: false,
          isSuccess: false,
          error: null,
        }),
      }));

      const { useAcceptQuoteState } = await import('./useAcceptQuoteState');
      const { result } = renderHook(() => useAcceptQuoteState(mockUuid));

      expect(result.current.error).toEqual(mockError);
    });

    it('should set error when initial transaction fails', async () => {
      const mockError = {
        code: 'MER-PAY-2008',
        message: 'Transaction not found',
      };

      vi.resetModules();
      vi.doMock('@/lib/queries', () => ({
        useTransactionSummary: vi.fn().mockReturnValue({
          data: null,
          error: {
            response: {
              data: mockError,
            },
          },
          isPending: false,
        }),
        useUpdateTransactionSummary: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          data: null,
          error: null,
          isPending: false,
        }),
        useConfirmQuote: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          isPending: false,
          isSuccess: false,
          error: null,
        }),
      }));

      const { useAcceptQuoteState } = await import('./useAcceptQuoteState');
      const { result } = renderHook(() => useAcceptQuoteState(mockUuid));

      expect(result.current.error).toEqual(mockError);
    });

    it('should set error when confirm quote fails', async () => {
      const mockError = { code: 'MER-PAY-2002', message: 'Quote expired' };

      vi.resetModules();
      vi.doMock('@/lib/queries', () => ({
        useTransactionSummary: vi.fn().mockReturnValue({
          data: MOCK_TRANSACTION_SUMMARY,
          error: null,
          isPending: false,
        }),
        useUpdateTransactionSummary: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          data: null,
          error: null,
          isPending: false,
        }),
        useConfirmQuote: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          isPending: false,
          isSuccess: false,
          error: mockError,
        }),
      }));

      const { useAcceptQuoteState } = await import('./useAcceptQuoteState');
      const { result } = renderHook(() => useAcceptQuoteState(mockUuid));

      expect(result.current.error).toEqual(mockError);
    });
  });

  describe('Redirects', () => {
    it('should redirect to expired page when transaction status is EXPIRED', async () => {
      const expiredTransaction = {
        ...MOCK_TRANSACTION_SUMMARY,
        status: 'EXPIRED',
      };

      vi.resetModules();
      vi.doMock('@/lib/queries', () => ({
        useTransactionSummary: vi.fn().mockReturnValue({
          data: expiredTransaction,
          error: null,
          isPending: false,
        }),
        useUpdateTransactionSummary: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          data: null,
          error: null,
          isPending: false,
        }),
        useConfirmQuote: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          isPending: false,
          isSuccess: false,
          error: null,
        }),
      }));

      const { useAcceptQuoteState } = await import('./useAcceptQuoteState');
      renderHook(() => useAcceptQuoteState(mockUuid));

      expect(redirect).toHaveBeenCalledWith(`/payin/${mockUuid}/expired`);
    });

    it('should redirect to pay page when quote status is ACCEPTED', async () => {
      const acceptedTransaction = {
        ...MOCK_TRANSACTION_SUMMARY,
        quoteStatus: 'ACCEPTED',
      };

      vi.resetModules();
      vi.doMock('@/lib/queries', () => ({
        useTransactionSummary: vi.fn().mockReturnValue({
          data: acceptedTransaction,
          error: null,
          isPending: false,
        }),
        useUpdateTransactionSummary: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          data: null,
          error: null,
          isPending: false,
        }),
        useConfirmQuote: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          isPending: false,
          isSuccess: false,
          error: null,
        }),
      }));

      const { useAcceptQuoteState } = await import('./useAcceptQuoteState');
      renderHook(() => useAcceptQuoteState(mockUuid));

      expect(redirect).toHaveBeenCalledWith(`/payin/${mockUuid}/pay`);
    });

    it('should redirect to expired page when update error has expired code', async () => {
      const mockError = {
        code: 'MER-PAY-2004',
        message: 'Transaction expired',
      };

      vi.resetModules();
      vi.doMock('@/lib/queries', () => ({
        useTransactionSummary: vi.fn().mockReturnValue({
          data: MOCK_TRANSACTION_SUMMARY,
          error: null,
          isPending: false,
        }),
        useUpdateTransactionSummary: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          data: null,
          error: mockError,
          isPending: false,
        }),
        useConfirmQuote: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          isPending: false,
          isSuccess: false,
          error: null,
        }),
      }));

      const { useAcceptQuoteState } = await import('./useAcceptQuoteState');
      renderHook(() => useAcceptQuoteState(mockUuid));

      expect(redirect).toHaveBeenCalledWith(`/payin/${mockUuid}/expired`);
    });

    it('should redirect to pay page when confirm quote succeeds', async () => {
      vi.resetModules();
      vi.doMock('@/lib/queries', () => ({
        useTransactionSummary: vi.fn().mockReturnValue({
          data: MOCK_TRANSACTION_SUMMARY,
          error: null,
          isPending: false,
        }),
        useUpdateTransactionSummary: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          data: null,
          error: null,
          isPending: false,
        }),
        useConfirmQuote: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          isPending: false,
          isSuccess: true,
          error: null,
        }),
      }));

      const { useAcceptQuoteState } = await import('./useAcceptQuoteState');
      renderHook(() => useAcceptQuoteState(mockUuid));

      expect(redirect).toHaveBeenCalledWith(`/payin/${mockUuid}/pay`);
    });
  });

  describe('State Updates', () => {
    it('should update transaction when updated transaction data is available', async () => {
      const updatedTransaction = {
        ...MOCK_TRANSACTION_SUMMARY,
        paidCurrency: { amount: 0.003, currency: 'BTC', actual: 0.003 },
      };

      vi.resetModules();
      vi.doMock('@/lib/queries', () => ({
        useTransactionSummary: vi.fn().mockReturnValue({
          data: MOCK_TRANSACTION_SUMMARY,
          error: null,
          isPending: false,
        }),
        useUpdateTransactionSummary: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          data: updatedTransaction,
          error: null,
          isPending: false,
        }),
        useConfirmQuote: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          isPending: false,
          isSuccess: false,
          error: null,
        }),
      }));

      const { useAcceptQuoteState } = await import('./useAcceptQuoteState');
      const { result } = renderHook(() => useAcceptQuoteState(mockUuid));

      expect(result.current.transaction).toEqual({
        ...updatedTransaction,
        currencyOptions: MOCK_TRANSACTION_SUMMARY.currencyOptions,
      });
    });

    it('should show loading state when any operation is pending', async () => {
      vi.resetModules();
      vi.doMock('@/lib/queries', () => ({
        useTransactionSummary: vi.fn().mockReturnValue({
          data: MOCK_TRANSACTION_SUMMARY,
          error: null,
          isPending: false,
        }),
        useUpdateTransactionSummary: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          data: null,
          error: null,
          isPending: true,
        }),
        useConfirmQuote: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          isPending: false,
          isSuccess: false,
          error: null,
        }),
      }));

      const { useAcceptQuoteState } = await import('./useAcceptQuoteState');
      const { result } = renderHook(() => useAcceptQuoteState(mockUuid));

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('Confirm Quote', () => {
    it('should call confirm quote mutation', async () => {
      const mockMutate = vi.fn();

      vi.resetModules();
      vi.doMock('@/lib/queries', () => ({
        useTransactionSummary: vi.fn().mockReturnValue({
          data: MOCK_TRANSACTION_SUMMARY,
          error: null,
          isPending: false,
        }),
        useUpdateTransactionSummary: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          data: null,
          error: null,
          isPending: false,
        }),
        useConfirmQuote: vi.fn().mockReturnValue({
          mutate: mockMutate,
          isPending: false,
          isSuccess: false,
          error: null,
        }),
      }));

      const { useAcceptQuoteState } = await import('./useAcceptQuoteState');
      const { result } = renderHook(() => useAcceptQuoteState(mockUuid));

      act(() => {
        result.current.confirmQuote();
      });

      expect(mockMutate).toHaveBeenCalled();
    });
  });
});
