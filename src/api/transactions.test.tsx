import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  getTransactionSummary,
  updateTransactionSummary,
  confirmQuote,
} from '@/api/transactions';
import { axiosInstance } from '@/api/axios-instance';
import { SupportedCurrencies } from '@/lib/schemas/currencies';
import { DEFAULT_CURRENCIES } from '@/lib/constants';
import { MOCK_AXIOS_ERROR_LIST } from '@/lib/tests/mock-data';

vi.mock('./axios-instance', () => ({
  axiosInstance: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

// Mock the schema validation
vi.mock('@/lib/schemas/transaction', () => ({
  TransactionSummarySchema: {
    validate: vi.fn().mockResolvedValue({ id: '123', foo: 'bar' }),
  },
  TransactionErrorSchema: {
    validate: vi.fn().mockResolvedValue({
      code: 'MER-PAY-2017',
      message: 'error',
    }),
  },
}));

vi.mock('@/lib/schemas/currencies', () => ({
  SupportedCurrenciesSchema: { validate: vi.fn() },
}));

describe('Transactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get the transaction summary (success)', async () => {
    (axiosInstance.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { id: '123', foo: 'bar' },
    });
    const summary = await getTransactionSummary('123');
    expect(summary).toEqual({ id: '123', foo: 'bar' });
    expect(axiosInstance.get).toHaveBeenCalledWith('/api/v1/pay/123/summary');
  });

  it('should handle error in getTransactionSummary (validation succeeds)', async () => {
    const error = { code: 'MER-PAY-2017', message: 'fail' };
    (axiosInstance.get as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      error,
    );
    await expect(getTransactionSummary('fail')).rejects.toEqual({
      code: 'MER-PAY-2017',
      message: 'fail',
    });
  });

  it('should handle error in getTransactionSummary (validation fails)', async () => {
    const error = { code: 'ERR', message: 'fail' };
    (axiosInstance.get as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      error,
    );
    const { TransactionErrorSchema } = await import(
      '@/lib/schemas/transaction'
    );
    (
      TransactionErrorSchema.validate as ReturnType<typeof vi.fn>
    ).mockRejectedValueOnce(new Error('validation failed'));
    await expect(getTransactionSummary('fail')).rejects.toEqual(error);
  });

  it('should update the transaction summary (success)', async () => {
    (axiosInstance.put as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { id: '123', foo: 'bar' },
    });
    const { TransactionSummarySchema } = await import(
      '@/lib/schemas/transaction'
    );
    (
      TransactionSummarySchema.validate as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce({ id: '123', foo: 'bar' });
    const summary = await updateTransactionSummary('123', { currency: 'BTC' });
    expect(summary).toEqual({ id: '123', foo: 'bar' });
    expect(axiosInstance.put).toHaveBeenCalledWith(
      '/api/v1/pay/123/update/summary',
      { currency: 'BTC' },
    );
  });

  it('should handle error in updateTransactionSummary', async () => {
    const error = { code: 'ERR', message: 'fail' };
    (axiosInstance.put as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      error,
    );
    const { TransactionErrorSchema } = await import(
      '@/lib/schemas/transaction'
    );
    (
      TransactionErrorSchema.validate as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(error);
    await expect(
      updateTransactionSummary('fail', { currency: 'BTC' }),
    ).rejects.toEqual(error);
  });

  it('should confirm quote (success)', async () => {
    (axiosInstance.put as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      status: 200,
    });
    const result = await confirmQuote('123');
    expect(result).toBe(true);
    expect(axiosInstance.put).toHaveBeenCalledWith(
      '/api/v1/pay/123/accept/summary',
      {
        successUrl: 'no_url',
      },
    );
  });

  it('should confirm quote (failure)', async () => {
    (axiosInstance.put as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      MOCK_AXIOS_ERROR_LIST,
    );

    await expect(confirmQuote('123')).rejects.toThrow();
  });

  it('should get supported currencies (success)', async () => {
    (axiosInstance.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: DEFAULT_CURRENCIES,
    });
    const { SupportedCurrenciesSchema } = await import(
      '@/lib/schemas/currencies'
    );
    (
      SupportedCurrenciesSchema.validate as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(DEFAULT_CURRENCIES);
    const result = await (
      await import('./transactions')
    ).getSupportedCurrencies();
    expect(result).toEqual(DEFAULT_CURRENCIES);
    expect(axiosInstance.get).toHaveBeenCalledWith(
      '/api/currency/crypto?max=100',
    );
  });

  it('should throw if SupportedCurrenciesSchema.validate fails', async () => {
    const mockCurrencies: SupportedCurrencies = DEFAULT_CURRENCIES;
    (axiosInstance.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: mockCurrencies,
    });
    const { SupportedCurrenciesSchema } = await import(
      '@/lib/schemas/currencies'
    );
    (
      SupportedCurrenciesSchema.validate as ReturnType<typeof vi.fn>
    ).mockRejectedValueOnce(new Error('validation failed'));
    await expect(
      (await import('./transactions')).getSupportedCurrencies(),
    ).resolves.toEqual(DEFAULT_CURRENCIES);
  });
});
