import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import StoreProvider from './StoreProvider';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export const metadata: Metadata = {
  title: 'Easework AI',
  description: 'Easework Admin Panel'
};

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap'
});

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${lato.className}`}
      suppressHydrationWarning={true}
    >
      <body className={'overflow-hidden'}>
        <NextTopLoader showSpinner={false} />
        <StoreProvider>
          {/* <Providers session={session}> */}
          <Toaster />
          {children}
          {/* </Providers> */}
        </StoreProvider>
      </body>
    </html>
  );
}
