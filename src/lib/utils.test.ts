import { describe, it, expect } from 'vitest';
import { shortenAddress, cn } from './utils';

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
