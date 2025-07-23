'use client';

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { SupportedCurrencies } from '@/lib/schemas/currencies';
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { supportedCurrenciesAtom } from '@/store/currencies';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
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
  const setSupportedCurrencies = useSetAtom(supportedCurrenciesAtom);

  useEffect(() => {
    setSupportedCurrencies(currencies);
  }, [currencies, setSupportedCurrencies]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
