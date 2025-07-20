export type PayInMethod = 'crypto';

export enum QuoteStatus {
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  ACCEPTED = 'ACCEPTED',
  FAILED = 'FAILED',
}

export type UpdateTransactionSummaryRequest = {
  currency: string;
  payInMethod: PayInMethod;
};
