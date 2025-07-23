import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import Providers from './providers';
import './globals.css';
import { getSupportedCurrencies } from '@/api/transactions';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

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
      <body
        className={cn(
          inter.variable,
          'bg-background flex h-screen w-screen items-center justify-center',
          'antialiased',
        )}
      >
        <Providers currencies={currencies}>{children}</Providers>
      </body>
    </html>
  );
}
