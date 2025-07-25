import type { Metadata } from 'next';

import { getSupportedCurrencies } from '@/api/transactions';
import Providers from '@/app/providers';

import './globals.css';

export const metadata: Metadata = {
  title: 'BVNK - Test',
  description: 'Frontend Test for BVNK by Andre Vasconcelos',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currencies = await getSupportedCurrencies();
  return (
    <html lang='en'>
      <body className='bg-background flex h-screen w-screen items-center justify-center antialiased'>
        <Providers currencies={currencies}>{children}</Providers>
      </body>
    </html>
  );
}
