import React from 'react';
import { render } from '@testing-library/react';
import { vi, expect } from 'vitest';
import Providers from './providers';
import { useSetAtom } from 'jotai';
import { SupportedCurrencies } from '@/lib/schemas/currencies';

vi.mock('jotai', () => ({
  useSetAtom: vi.fn(),
  atom: vi.fn(),
}));

const mockCurrencies: SupportedCurrencies = [
  {
    id: 1,
    code: 'BTC',
    fiat: false,
    icon: null,
    name: 'Bitcoin',
    withdrawalParameters: [],
    options: {},
    withdrawalFee: 0,
    depositFee: 0,
  },
];

describe('Providers', () => {
  it('should render the providers and set the supported currencies', () => {
    const setSupportedCurrencies = vi.fn();
    (useSetAtom as ReturnType<typeof vi.fn>).mockReturnValue(
      setSupportedCurrencies,
    );

    render(
      <Providers currencies={mockCurrencies}>
        <div>test</div>
      </Providers>,
    );
    expect(setSupportedCurrencies).toHaveBeenCalledWith(mockCurrencies);
  });
});
