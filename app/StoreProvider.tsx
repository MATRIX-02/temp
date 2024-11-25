'use client';

import { ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { store } from '@/lib/store/store';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  checkAuthStatus,
  selectAuth
} from '@/lib/store/features/auth/authSlice';
import { useRouter } from 'next/navigation';

const StoreProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { isAuthenticated } = useAppSelector(selectAuth);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    } else {
      router.push('/dashboard/overview');
    }
  }, [isAuthenticated, router]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  );
};

export default StoreProvider;
