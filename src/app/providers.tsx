'use client';
import React from 'react';
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

// Utils
import { SupportedCurrencies } from '@/lib/schemas/currencies';
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

function HydrateAtoms({
  children,
  currencies,
}: {
  children: React.ReactNode;
  currencies: SupportedCurrencies;
}) {
  useHydrateAtoms([[supportedCurrenciesAtom, currencies]]);

  return <>{children}</>;
}

export default function Providers({
  children,
  currencies,
}: {
  children: React.ReactNode;
  currencies: SupportedCurrencies;
}) {
  const queryClient = getQueryClient();

  return (
    <JotaiProvider>
      <HydrateAtoms currencies={currencies}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </HydrateAtoms>
    </JotaiProvider>
  );
}
