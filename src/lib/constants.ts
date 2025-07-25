import { TransactionErrorCodes } from '@/lib/schemas/transaction';
import { SupportedCurrencies } from '@/lib/schemas/currencies';

export const REFRESH_QUOTE_INTERVAL = 1000;

// META: In here we would have an exhaustive list of all possible errors that can happen
// when interacting with the API.
export const API_ERROR_MESSAGES: Record<TransactionErrorCodes, string> = {
  'MER-PAY-2017':
    'Unable to change the status of this payment. Please create a new payment and try again.',
  'MER-PAY-2004':
    'The transaction has expired. Please create a new payment and try again.',
  'MER-PAY-2008':
    'The payment you requested has not been found. Please create a new payment and try again.',
  'MER-PAY-2028':
    "We couldn't process your payout request to the desired address, please try another one.",
  'MER-PAY-4002':
    'An unexpected error occurred. Please reload the page and try again.',
};

export const DEFAULT_CURRENCIES: SupportedCurrencies = [
  {
    id: 1,
    code: 'BTC',
    fiat: false,
    name: 'Bitcoin',
    icon: '',
    protocols: [],
    withdrawalParameters: [],
    options: {},
    withdrawalFee: 0,
    depositFee: 0,
    supportsDeposits: true,
    supportsWithdrawals: true,
    quantityPrecision: 8,
    pricePrecision: 8,
  },
  {
    id: 2,
    code: 'ETH',
    fiat: false,
    name: 'Ethereum',
    icon: '',
    protocols: [],
    withdrawalParameters: [],
    options: {},
    withdrawalFee: 0,
    depositFee: 0,
    supportsDeposits: true,
    supportsWithdrawals: true,
    quantityPrecision: 18,
    pricePrecision: 18,
  },
  {
    id: 3,
    code: 'LTC',
    fiat: true,
    name: 'Litecoin',
    icon: '',
    protocols: [],
    withdrawalParameters: [],
    options: {},
    withdrawalFee: 0,
    depositFee: 0,
    supportsDeposits: true,
    supportsWithdrawals: true,
  },
];
