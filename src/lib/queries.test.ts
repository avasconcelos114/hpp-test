import { vi, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import {
  useConfirmQuote,
  useTransactionSummary,
  useUpdateTransactionSummary,
} from './queries';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  MOCK_TRANSACTION_ERROR,
  MOCK_TRANSACTION_SUMMARY,
} from './tests/mock-data';
import { confirmQuote, updateTransactionSummary } from '@/api/transactions';
import { AxiosError } from 'axios';
import { TransactionError } from './schemas/transaction';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

vi.mock('@/api/transactions', () => ({
  updateTransactionSummary: vi.fn(),
  getTransactionSummary: vi.fn(),
  getSupportedCurrencies: vi.fn(),
  confirmQuote: vi.fn(),
}));

describe('useTransactionSummary', () => {
  const mockSetQueryData = vi.fn();
  const mockQueryClient = {
    setQueryData: mockSetQueryData,
  };

  it('should return the transaction summary', async () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: MOCK_TRANSACTION_SUMMARY,
    });
    const { data } = await useTransactionSummary('123');
    expect(data).toEqual(MOCK_TRANSACTION_SUMMARY);
    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['transaction-summary', '123'],
      queryFn: expect.any(Function),
      retry: 3,
      retryDelay: 1000,
    });
  });

  it('should return the error if the transaction summary is not found', async () => {
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      error: MOCK_TRANSACTION_ERROR,
    });
    const { error } = await useTransactionSummary('123');
    expect(error).toEqual(MOCK_TRANSACTION_ERROR);
  });

  it('should make the request to update the transaction summary', async () => {
    const mockMutateAsync = vi.fn();
    const mockMutate = vi.fn().mockImplementation(async (variables) => {
      const result = await updateTransactionSummary('123', {
        currency: variables.currency,
      });
      mockQueryClient.setQueryData(['transaction-summary', '123'], result);
      return result;
    });

    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: false,
      isSuccess: true,
      isIdle: false,
      isPaused: false,
      data: MOCK_TRANSACTION_SUMMARY,
      error: null,
      variables: { currency: 'BTC' },
      reset: vi.fn(),
      status: 'success',
      context: undefined,
      failureCount: 0,
      failureReason: null,
      submittedAt: Date.now(),
    });

    const { result } = renderHook(() => useUpdateTransactionSummary('123'));
    await act(async () => {
      await result.current.mutate({
        currency: 'BTC',
      });
    });

    expect(result.current.mutate).toHaveBeenCalledWith({ currency: 'BTC' });
    expect(useMutation).toHaveBeenCalledWith({
      onError: expect.any(Function),
      mutationFn: expect.any(Function),
      retry: 3,
      retryDelay: 1000,
    });
  });

  it('should make the request to confirm the quote', async () => {
    const mockMutateAsync = vi.fn();
    const mockMutate = vi.fn().mockImplementation(async () => {
      const result = await confirmQuote('123');
      mockQueryClient.setQueryData(['transaction-summary', '123'], result);
      return result;
    });

    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: false,
      isSuccess: true,
      isIdle: false,
      isPaused: false,
      data: true,
      error: null,
      variables: undefined,
      reset: vi.fn(),
      status: 'success',
      context: undefined,
      failureCount: 0,
      failureReason: null,
      submittedAt: Date.now(),
    });

    const { result } = renderHook(() => useConfirmQuote('123'));
    await act(async () => {
      await result.current.mutate();
    });
    expect(result.current.mutate).toHaveBeenCalled();
    expect(useMutation).toHaveBeenCalledWith({
      onError: expect.any(Function),
      mutationFn: expect.any(Function),
      retry: 3,
      retryDelay: 1000,
    });
  });

  it('should return the error if update transaction summary fails', async () => {
    const mockError = {
      isAxiosError: true,
      response: {
        data: {
          code: 'MER-PAY-2008',
          message: 'Transaction not found',
          requestId: '123',
          status: '404',
        },
      },
    } as AxiosError<TransactionError>;

    const mockOnError = vi.fn();

    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isPending: false,
      isError: true,
      isSuccess: false,
      isIdle: false,
      isPaused: false,
      data: undefined,
      error: mockError.response?.data,
      variables: { currency: 'BTC' },
      reset: vi.fn(),
      status: 'error',
      context: undefined,
      failureCount: 1,
      failureReason: mockError,
      submittedAt: Date.now(),
    });

    const { result } = renderHook(() => useUpdateTransactionSummary('123'));

    expect(result.current.error).toEqual(mockError.response?.data);
    expect(useMutation).toHaveBeenCalledWith({
      onError: expect.any(Function),
      mutationFn: expect.any(Function),
      retry: 3,
      retryDelay: 1000,
    });
  });

  it('should execute onError callback and return the error', async () => {
    const mockError = {
      code: 'MER-PAY-2008' as const,
      message: 'Transaction not found',
    } as TransactionError;

    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isPending: false,
      isError: false,
      isSuccess: false,
      isIdle: true,
      isPaused: false,
      data: undefined,
      error: null,
      variables: undefined,
      reset: vi.fn(),
      status: 'idle',
      context: undefined,
      failureCount: 0,
      failureReason: null,
      submittedAt: Date.now(),
    });

    renderHook(() => useUpdateTransactionSummary('123'));

    expect(useMutation).toHaveBeenCalledWith({
      onError: expect.any(Function),
      mutationFn: expect.any(Function),
      retry: 3,
      retryDelay: 1000,
    });

    // Get the onError callback that was passed to useMutation
    const useMutationCall = vi.mocked(useMutation).mock.calls[0][0];
    const onErrorCallback = useMutationCall.onError;

    // Test that the onError callback is a function that returns the error
    expect(typeof onErrorCallback).toBe('function');
    if (onErrorCallback) {
      const result = onErrorCallback(mockError, { currency: 'BTC' }, undefined);
      expect(result).toEqual(mockError);
    }
  });

  it('should return the error if the confirm quote fails', async () => {
    const mockError = {
      isAxiosError: true,
      response: {
        data: {
          message: 'Test error',
        },
      },
    } as AxiosError;

    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isPending: false,
      isError: true,
      isSuccess: false,
      isIdle: false,
      isPaused: false,
      data: undefined,
      error: mockError.response?.data,
      variables: undefined,
      reset: vi.fn(),
      status: 'error',
      context: undefined,
      failureCount: 1,
      failureReason: mockError,
      submittedAt: Date.now(),
    });

    const { result } = renderHook(() => useConfirmQuote('123'));

    expect(result.current.error).toEqual(mockError.response?.data);
    expect(useMutation).toHaveBeenCalledWith({
      onError: expect.any(Function),
      mutationFn: expect.any(Function),
    });
  });
});
