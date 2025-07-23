'use client';

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { SupportedCurrencies } from '@/lib/schemas/currencies';
import { useEffect } from 'react';
import { useCurrenciesStore } from '@/store/currencies';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // caching for 30 seconds to avoid refetching immediately on the client
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({
  children,
  currencies,
}: {
  children: React.ReactNode;
  currencies: SupportedCurrencies;
}) {
  const queryClient = getQueryClient();
  const { setSupportedCurrencies } = useCurrenciesStore();

  useEffect(() => {
    setSupportedCurrencies(currencies);
  }, [currencies]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
