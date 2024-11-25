'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  checkAuthStatus,
  selectAuth
} from '@/lib/store/features/auth/authSlice';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(selectAuth);
  const router = useRouter();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    } else {
      router.push('/dashboard/overview');
    }
  }, [isAuthenticated, router]);

  return null;
}
