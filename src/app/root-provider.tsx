import { getSupportedCurrencies } from '@/api/transactions';
import Providers from '@/app/providers';
import React from 'react';

export default async function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const currencies = await getSupportedCurrencies();
  return <Providers currencies={currencies}>{children}</Providers>;
}
