import { object, string, number, InferType, array, boolean } from 'yup';

export const PayInMethodSchema = string().oneOf([
  'crypto',
  'bank', // META: Sample of alternative value but we will work with only 'crypto' for the test
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
  'merchantPayOut', // META: Educated guess based on other subType but I would confirm with other devs what values exist
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
});
export type UpdateTransactionSummaryRequest = InferType<
  typeof UpdateTransactionSummaryRequestSchema
>;

export const CurrencyOptionSchema = object({
  code: string().required(),
  protocols: array().of(string().uppercase().required()).required(),
});

export const ExchangeRateSchema = object({
  base: string().required(),
  counter: string().required(),
  rate: number().required(),
});
export type ExchangeRate = InferType<typeof ExchangeRateSchema>;

export const NetworkFeeBilledToSchema = string().oneOf([
  'MERCHANT',
  'CUSTOMER', // Another educated guess
]);
export type NetworkFeeBilledTo = InferType<typeof NetworkFeeBilledToSchema>;

export const AddressSchema = object({
  address: string().required(),
  alternatives: array().of(string()).nullable(),
  protocol: string().required(),
  tag: string().nullable(),
  uri: string().required(),
});
export type Address = InferType<typeof AddressSchema>;

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
  paidCurrency: TransactionCurrencySchema.nullable(),
  feeCurrency: TransactionCurrencySchema.required(),
  networkFeeCurrency: TransactionCurrencySchema.required(),
  displayRate: ExchangeRateSchema.nullable(),
  exchangeRate: ExchangeRateSchema.nullable(),
  address: AddressSchema.nullable(),
  returnUrl: string(),
  redirectUrl: string().nullable(),
  transactions: array().of(object()).required(),
  refund: object().nullable(),
  refunds: array().of(object()).required(),
  currencyOptions: array().of(CurrencyOptionSchema).nullable(),
  flow: string().nullable(),
  twoStep: boolean().required(),
  pegged: boolean().required(),
  customerId: string().required(),
  networkFeeBilledTo: NetworkFeeBilledToSchema.required(),
  networkFeeRates: array(),
  walletId: string().required(),
});
export type TransactionSummary = InferType<typeof TransactionSummarySchema>;

export const TransactionErrorCodesSchema = string()
  .oneOf([
    'MER-PAY-2008',
    'MER-PAY-2017',
    'MER-PAY-2004',
    'MER-PAY-2028',
    'MER-PAY-4002',
  ])
  .required();
export type TransactionErrorCodes = InferType<
  typeof TransactionErrorCodesSchema
>;

export const TransactionErrorSchema = object({
  code: TransactionErrorCodesSchema.required(),
  message: string().required(),
  documentLink: string().nullable(),
  status: string().nullable(),
  requestId: string().nullable(),
});
export type TransactionError = InferType<typeof TransactionErrorSchema>;
