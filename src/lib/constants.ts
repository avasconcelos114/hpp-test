import { SupportedCurrencies } from '@/lib/schemas/pages';
import { TransactionErrorCodes } from '@/lib/schemas/transaction';

export const REFRESH_QUOTE_INTERVAL = 1000;

export const API_ERROR_MESSAGES: Record<TransactionErrorCodes, string> = {
  'MER-PAY-2017':
    'Unable to change the status of this payment. Please create a new payment and try again.',
  'MER-PAY-2004':
    'The transaction has expired. Please create a new payment and try again.',
  'MER-PAY-2008':
    'The payment you requested has not been found. Please create a new payment and try again.',
  'MER-PAY-2028':
    "We couldn't process your payout request to the desired address, please try another one.",
};

export const SUPPORTED_CURRENCIES_MAP: Record<SupportedCurrencies, string> = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  LTC: 'Litecoin',
};
