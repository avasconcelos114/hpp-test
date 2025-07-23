import { object, string, number, array, boolean, InferType } from 'yup';

export const ProtocolSchema = object({
  code: string().required(),
  network: string().required(),
  networkCode: string().required(),
});

export const SupportedCurrencySchema = object({
  id: number().required(),
  code: string().required(),
  fiat: boolean().required(),
  icon: string().nullable(),
  name: string().required(),
  withdrawalParameters: array().required(),
  options: object().required(),
  withdrawalFee: number().required(),
  depositFee: number().required(),
  supportsDeposits: boolean().required(),
  supportsWithdrawals: boolean().required(),
  quantityPrecision: number().required(),
  pricePrecision: number().required(),
  protocols: array().of(ProtocolSchema),
});
export type SupportedCurrency = InferType<typeof SupportedCurrencySchema>;

export const SupportedCurrenciesSchema = array().of(SupportedCurrencySchema);
export type SupportedCurrencies = InferType<typeof SupportedCurrenciesSchema>;
