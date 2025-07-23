import { array, InferType, object, string } from 'yup';

export const payInPageSchema = object({
  uuid: string().uuid().required(),
});

export const supportedCurrenciesSchema = string()
  .oneOf(['BTC', 'ETH', 'LTC'])
  .required();
export type SupportedCurrencies = InferType<typeof supportedCurrenciesSchema>;
