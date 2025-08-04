import React from 'react';
import { render } from '@testing-library/react';
import { vi, expect, beforeEach } from 'vitest';
import Providers from './providers';
import { useHydrateAtoms } from 'jotai/utils';
import { SupportedCurrencies } from '@/lib/schemas/currencies';

vi.mock('jotai', () => ({
  useSetAtom: vi.fn(),
  atom: vi.fn(() => 'mock-atom'),
  Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('jotai/utils', () => ({
  useHydrateAtoms: vi.fn(),
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
  beforeEach(() => {
    vi.mocked(useHydrateAtoms).mockClear();
  });

  it('should render the providers and set the supported currencies', () => {
    render(
      <Providers currencies={mockCurrencies}>
        <div>test</div>
      </Providers>,
    );
    expect(useHydrateAtoms).toHaveBeenCalledWith([
      ['mock-atom', mockCurrencies],
    ]);
  });
});
