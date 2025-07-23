import { create } from 'zustand';
import { SupportedCurrencies } from '@/lib/schemas/currencies';

interface CurrenciesState {
  supportedCurrencies: SupportedCurrencies;
  setSupportedCurrencies: (currencies: SupportedCurrencies) => void;
}

export const useCurrenciesStore = create<CurrenciesState>((set) => ({
  supportedCurrencies: [],
  setSupportedCurrencies: (currencies) =>
    set({ supportedCurrencies: currencies }),
}));
