import { atom } from 'jotai';
import { SupportedCurrencies } from '@/lib/schemas/currencies';

export const supportedCurrenciesAtom = atom<SupportedCurrencies>([]);
