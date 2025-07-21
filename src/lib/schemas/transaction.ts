import { object, string, number, InferType, array, boolean } from 'yup';

export const PayInMethodSchema = string().oneOf([
  'crypto',
  'bank', // Sample of alternative value but we will work with only 'crypto' for the test
]);
export type PayInMethod = InferType<typeof PayInMethodSchema>;

export const QuoteStatusSchema = string().oneOf([
  'PENDING',
  'EXPIRED',
  'ACCEPTED',
  'FAILED',
  'TEMPLATE',
]);
export type QuoteStatus = InferType<typeof QuoteStatusSchema>;

export const TransactionStatusSchema = string().oneOf([
  'PENDING',
  'COMPLETED',
  'FAILED',
  'EXPIRED',
]);
export type TransactionStatus = InferType<typeof TransactionStatusSchema>;

export const TransactionTypeSchema = string().oneOf(['IN', 'OUT']);

export const TransactionSubTypeSchema = string().oneOf([
  'merchantPayIn',
  'merchantPayOut', // Educated guess based on other subType but I would confirm with other devs what values exist
]);
export type TransactionSubType = InferType<typeof TransactionSubTypeSchema>;

export const TransactionCurrencySchema = object({
  currency: string().nullable(),
  amount: number().required(),
  actual: number().required(),
});
export type TransactionCurrency = InferType<typeof TransactionCurrencySchema>;

export const UpdateTransactionSummaryRequestSchema = object({
  currency: string().required(),
  payInMethod: PayInMethodSchema.required(),
});
export type UpdateTransactionSummaryRequest = InferType<
  typeof UpdateTransactionSummaryRequestSchema
>;

export const CurrencyOptionSchema = object({
  code: string().required(),
  protocols: array().of(string().uppercase().required()).required(),
});

export const NetworkFeeBilledToSchema = string().oneOf([
  'MERCHANT',
  'CUSTOMER', // Another educated guess
]);
export type NetworkFeeBilledTo = InferType<typeof NetworkFeeBilledToSchema>;

export const TransactionSummarySchema = object({
  uuid: string().required(),
  merchantDisplayName: string().required(),
  merchantId: string().uuid().required(),
  dateCreated: number().required(),
  expiryDate: number().required(),
  quoteExpiryDate: number().nullable(),
  acceptanceExpiryDate: number().nullable(),
  quoteStatus: QuoteStatusSchema.required(),
  reference: string().required(),
  type: TransactionTypeSchema.required(),
  subType: TransactionSubTypeSchema.required(),
  status: TransactionStatusSchema.required(),
  displayCurrency: TransactionCurrencySchema.required(),
  walletCurrency: TransactionCurrencySchema.required(),
  paidCurrency: TransactionCurrencySchema.required(),
  feeCurrency: TransactionCurrencySchema.required(),
  networkFeeCurrency: TransactionCurrencySchema.required(),
  displayRate: number().nullable(),
  exchangeRate: number().nullable(),
  address: string().nullable(),
  returnUrl: string(),
  redirectUrl: string().nullable(),
  transactions: array().of(object()).required(),
  refund: object().nullable(),
  refunds: array().of(object()).required(),
  currencyOptions: array().of(CurrencyOptionSchema).required(),
  flow: string().required(),
  twoStep: boolean().required(),
  pegged: boolean().required(),
  customerId: string().required(),
  networkFeeBilledTo: string().required(),
  networkFeeRates: array(),
  walletId: string().required(),
});
export type TransactionSummary = InferType<typeof TransactionSummarySchema>;
