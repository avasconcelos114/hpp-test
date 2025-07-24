import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from './useTimer';

const advanceTime = (ms: number) => {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
};

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(1_700_000_000_000); // fixed base time
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return correct timeLeft when expiry is in the future', () => {
    const expiry = 1_700_000_000_000 + 10_000; // 10 seconds from now
    const { result } = renderHook(() => useTimer(expiry));
    expect(result.current.timeLeft).toBe(10_000);
    expect(result.current.isExpired).toBe(false);
    expect(result.current.formattedTimeUntilExpiry).toBe('00:00:10');
  });

  it('should return isExpired=true and timeLeft=0 when expired', () => {
    const expiry = 1_700_000_000_000 - 1_000; // 1 second in the past
    const { result } = renderHook(() => useTimer(expiry));
    expect(result.current.timeLeft).toBe(0);
    expect(result.current.isExpired).toBe(true);
    expect(result.current.formattedTimeUntilExpiry).toBe('00:00:00');
  });

  it('should update timeLeft and formattedTimeUntilExpiry as time passes', () => {
    const expiry = 1_700_000_000_000 + 5_000; // 5 seconds from now
    const { result } = renderHook(() => useTimer(expiry));
    expect(result.current.timeLeft).toBe(5_000);
    expect(result.current.formattedTimeUntilExpiry).toBe('00:00:05');
    advanceTime(2_000);
    expect(result.current.timeLeft).toBe(3_000);
    expect(result.current.formattedTimeUntilExpiry).toBe('00:00:03');
    advanceTime(3_000);
    expect(result.current.timeLeft).toBe(0);
    expect(result.current.isExpired).toBe(true);
    expect(result.current.formattedTimeUntilExpiry).toBe('00:00:00');
  });

  it('should handle null expiryDate', () => {
    const { result } = renderHook(() => useTimer(null));
    expect(result.current.timeLeft).toBe(0);
    expect(result.current.isExpired).toBe(true);
    expect(result.current.formattedTimeUntilExpiry).toBe('00:00:00');
  });
});
