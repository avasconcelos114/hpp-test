'use client';
import { useEffect, useState, useRef } from 'react';

import { REFRESH_QUOTE_INTERVAL } from '@/lib/constants';

export function useTimer(expiryDate: number | null) {
  const [now, setNow] = useState(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  function clearCurrentInterval() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }

  function tickInterval() {
    setNow(Date.now());
  }

  useEffect(() => {
    if (!expiryDate) return;

    tickInterval();
    clearCurrentInterval();

    intervalRef.current = setInterval(tickInterval, REFRESH_QUOTE_INTERVAL);
    return () => {
      clearCurrentInterval();
    };
  }, [expiryDate]);

  const timeLeft = expiryDate ? Math.max(expiryDate - now, 0) : 0;
  const isExpired = timeLeft === 0;

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  const formattedTimeUntilExpiry = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return { timeLeft, isExpired, formattedTimeUntilExpiry };
}
