import { object, string, number, array, boolean, InferType } from 'yup';

export const ProtocolSchema = object({
  code: string().required(),
  network: string().required(),
  networkCode: string().required(),
});

export const SupportedCurrencySchema = object({
  id: number(),
  code: string().required(),
  fiat: boolean(),
  icon: string().nullable(),
  name: string().required(),
  withdrawalParameters: array(),
  options: object(),
  withdrawalFee: number(),
  depositFee: number(),
  supportsDeposits: boolean(),
  supportsWithdrawals: boolean(),
  quantityPrecision: number(),
  pricePrecision: number(),
  protocols: array().of(ProtocolSchema),
});
export type SupportedCurrency = InferType<typeof SupportedCurrencySchema>;

export const SupportedCurrenciesSchema = array().of(SupportedCurrencySchema);
export type SupportedCurrencies = InferType<typeof SupportedCurrenciesSchema>;
