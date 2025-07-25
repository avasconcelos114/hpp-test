import { AxiosError, AxiosHeaders } from 'axios';
import { describe, it, expect } from 'vitest';
import { shortenAddress, cn, handleAPIError } from './utils';
import { TransactionError } from './schemas/transaction';

describe('shortenAddress', () => {
  it('should shorten an address to the first 6 and last 4 characters', () => {
    expect(shortenAddress('0x1234567890123456789012345678901234567890')).toBe(
      '0x1234...7890',
    );
  });

  it('should return an empty string if the address is not provided', () => {
    expect(shortenAddress('')).toBe('');
  });

  it('should return the full address if it is less than 10 characters', () => {
    expect(shortenAddress('0x1234567')).toBe('0x1234567');
  });
});

describe('cn', () => {
  it('should return an empty string if the class name is not provided', () => {
    expect(cn('')).toBe('');
  });

  it('should return the class name if multiple names are provided', () => {
    expect(cn('test', 'test2')).toBe('test test2');
  });
});

describe('handleAPIError', () => {
  it('should return the error if it is not an Axios error', async () => {
    const error = new Error('test');
    expect(await handleAPIError(error)).toStrictEqual(error);
  });

  it('should return the error if it is an Axios error', async () => {
    const error: TransactionError = {
      code: 'MER-PAY-2008',
      message: 'Transaction not found',
      requestId: '123',
      status: '404',
    };
    const config = {
      headers: new AxiosHeaders({ 'Content-Type': 'application/json' }),
    };
    const axiosError: AxiosError = new AxiosError(
      'Transaction not found',
      'MER-PAY-2008',
      config,
      {},
      {
        data: error,
        status: 404,
        statusText: 'Not Found',
        headers: new AxiosHeaders({ 'Content-Type': 'application/json' }),
        config,
      },
    );
    expect(await handleAPIError(axiosError)).toStrictEqual(error);
  });
});
