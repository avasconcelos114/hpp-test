import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils/style';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BVNK - Test',
  description: 'Frontend Test for BVNK by Andre Vasconcelos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={cn(
          inter.variable,
          'flex h-screen w-screen items-center justify-center',
          'antialiased',
        )}
      >
        {children}
      </body>
    </html>
  );
}
