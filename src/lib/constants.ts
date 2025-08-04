import {
  TransactionErrorCodes,
  TransactionErrorCodesEnum,
} from '@/lib/schemas/transaction';
import { SupportedCurrencies } from '@/lib/schemas/currencies';

export const REFRESH_QUOTE_INTERVAL = 1000;

// META: In here we would have an exhaustive list of all possible errors that can happen
// when interacting with the API.
export const API_ERROR_MESSAGES: Record<TransactionErrorCodes, string> = {
  [TransactionErrorCodesEnum.STATUS_CHANGE_ERROR]:
    'Unable to change the status of this payment. Please create a new payment and try again.',
  [TransactionErrorCodesEnum.EXPIRED_ERROR]:
    'The transaction has expired. Please create a new payment and try again.',
  [TransactionErrorCodesEnum.PAYMENT_NOT_FOUND_ERROR]:
    'The payment you requested has not been found. Please create a new payment and try again.',
  [TransactionErrorCodesEnum.PAYOUT_ADDRESS_ERROR]:
    "We couldn't process your payout request to the desired address, please try another one.",
  [TransactionErrorCodesEnum.UNEXPECTED_ERROR]:
    'An unexpected error occurred. Please refresh the page and try again.',
};

export const ALLOW_REFRESH_QUOTE_ERROR_CODES: TransactionErrorCodes[] = [
  TransactionErrorCodesEnum.UNEXPECTED_ERROR,
];

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
