import { AxiosError, AxiosHeaders } from 'axios';
import { TransactionError, TransactionSummary } from '../schemas/transaction';

export const MOCK_TRANSACTION_ERROR: TransactionError = {
  code: 'MER-PAY-2008',
  message: 'Transaction not found',
  requestId: '123',
  status: '404',
};

const MOCK_AXIOS_CONFIG = {
  headers: new AxiosHeaders({ 'Content-Type': 'application/json' }),
};

export const MOCK_AXIOS_ERROR_SINGLE: AxiosError = new AxiosError(
  'Transaction not found',
  'MER-PAY-2008',
  MOCK_AXIOS_CONFIG,
  {},
  {
    data: MOCK_TRANSACTION_ERROR,
    status: 404,
    statusText: 'Not Found',
    headers: new AxiosHeaders({ 'Content-Type': 'application/json' }),
    config: MOCK_AXIOS_CONFIG,
  },
);

export const MOCK_AXIOS_ERROR_LIST: AxiosError = new AxiosError(
  'Transaction not found',
  'MER-PAY-2008',
  MOCK_AXIOS_CONFIG,
  {},
  {
    data: {
      errorList: [MOCK_TRANSACTION_ERROR],
    },
    status: 404,
    statusText: 'Not Found',
    headers: new AxiosHeaders({ 'Content-Type': 'application/json' }),
    config: MOCK_AXIOS_CONFIG,
  },
);

export const MOCK_TRANSACTION_SUMMARY: TransactionSummary = {
  uuid: 'test-uuid-12345',
  merchantDisplayName: 'Test Merchant',
  merchantId: 'merchant-123',
  dateCreated: Date.now(),
  expiryDate: Date.now() + 1000 * 60 * 30,
  quoteExpiryDate: Date.now() + 1000 * 60 * 10,
  acceptanceExpiryDate: Date.now() + 1000 * 60 * 5,
  quoteStatus: 'PENDING',
  reference: 'REF-123456',
  type: 'IN',
  subType: 'merchantPayIn',
  status: 'PENDING',
  displayCurrency: {
    amount: 100.5,
    currency: 'EUR',
    actual: 100.5,
  },
  walletCurrency: {
    amount: 100.5,
    currency: 'EUR',
    actual: 100.5,
  },
  paidCurrency: {
    amount: 0.0025,
    currency: 'BTC',
    actual: 0.0025,
  },
  feeCurrency: {
    amount: 2.5,
    currency: 'EUR',
    actual: 2.5,
  },
  networkFeeCurrency: {
    amount: 0.0001,
    currency: 'BTC',
    actual: 0.0001,
  },
  displayRate: {
    base: 'BTC',
    counter: 'EUR',
    rate: 40000,
  },
  exchangeRate: {
    base: 'BTC',
    counter: 'EUR',
    rate: 40000,
  },
  address: {
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    uri: 'bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    protocol: 'BTC',
  },
  returnUrl: 'https://example.com/return',
  redirectUrl: 'https://example.com/redirect',
  transactions: [
    {
      id: 'tx-123',
      amount: 0.0025,
      currency: 'BTC',
      status: 'PENDING',
    },
  ],
  refund: null,
  refunds: [],
  currencyOptions: [
    {
      code: 'BTC',
      protocols: ['BTC'],
    },
    {
      code: 'ETH',
      protocols: ['ETH'],
    },
  ],
  flow: 'merchantPayIn',
  twoStep: false,
  pegged: false,
  customerId: 'customer-123',
  networkFeeBilledTo: 'CUSTOMER',
  networkFeeRates: [
    {
      currency: 'BTC',
      rate: 0.0001,
    },
  ],
  walletId: 'wallet-123',
};
