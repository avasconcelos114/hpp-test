import { ReactNode } from 'react';
import type { Metadata } from 'next';

import { cn } from '@/lib/utils';
import CurrenciesProvider from './currencies-provider';

import './globals.css';

export const metadata: Metadata = {
  title: 'BVNK - Test',
  description: 'Frontend Test for BVNK by Andre Vasconcelos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link
          rel='preconnect'
          href='https://fonts.googleapis.com'
          crossOrigin='anonymous'
        />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
          rel='preload'
          as='style'
          crossOrigin='anonymous'
        />
      </head>
      <body
        className={cn(
          'bg-background flex h-screen w-screen items-center justify-center antialiased',
          'font-inter',
        )}
      >
        <CurrenciesProvider>{children}</CurrenciesProvider>
      </body>
    </html>
  );
}
