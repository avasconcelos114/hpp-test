export type PayInMethod = 'crypto';

export enum QuoteStatus {
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  ACCEPTED = 'ACCEPTED',
  FAILED = 'FAILED',
  TEMPLATE = 'TEMPLATE',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum TransactionType {
  IN = 'IN',
  OUT = 'OUT',
}

export enum TransactionSubType {
  MERCHANT_PAY_IN = 'merchantPayIn',
}

export type TransactionCurrency = {
  currency: string;
  amount: number;
  actual: number;
};

export type UpdateTransactionSummaryRequest = {
  currency: string;
  payInMethod: PayInMethod;
};

export type TransactionSummary = {
  uuid: string;
  merchantDisplayName: string;
  merchantId: string;
  dateCreated: number;
  expiryDate: number;
  quoteExpiryDate: number | null;
  acceptanceExpiryDate: number | null;
  quoteStatus: QuoteStatus;
  reference: string;
  type: TransactionType;
  subType: TransactionSubType;
  status: TransactionStatus;
  displayCurrency: TransactionCurrency;
  walletCurrency: TransactionCurrency;
  paidCurrency: TransactionCurrency;
  feeCurrency: TransactionCurrency;
  displayRate: number | null;
  exchangeRate: number | null;
  address: string | null;
  returnUrl: string;
  redirectUrl: string;

  // These values aren't needed but I would normally speak to a backend developer or someone with domain knowledge
  // To figure out what the shape of these values should be and what do they represent
  // transactions: any[];
  // refund: any;
  // refunds: any[];
};
