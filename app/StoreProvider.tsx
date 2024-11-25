'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { store } from '@/lib/store/store';

const StoreProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  );
};

export default StoreProvider;
