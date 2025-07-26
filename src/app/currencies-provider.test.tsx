import React from 'react';
import { render } from '@testing-library/react';
import { vi, expect } from 'vitest';
import CurrenciesProvider from './currencies-provider';
import { getSupportedCurrencies } from '@/api/transactions';
import { DEFAULT_CURRENCIES } from '@/lib/constants';

vi.mock('@/api/transactions', () => ({
  getSupportedCurrencies: vi.fn(),
}));

describe('CurrenciesProvider', () => {
  it('should render the currencies provider and fetch the currencies', async () => {
    (getSupportedCurrencies as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      DEFAULT_CURRENCIES,
    );
    render(
      <CurrenciesProvider>
        <div>test</div>
      </CurrenciesProvider>,
    );
    expect(getSupportedCurrencies).toHaveBeenCalled();
  });
});
