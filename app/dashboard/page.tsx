//This is the Page for the Dashboard

'use client';

import { selectAuth } from '@/lib/store/features/auth/authSlice';
import { useAppSelector } from '@/lib/store/hooks';
import { RootState } from '@/lib/store/store';
import { redirect } from 'next/navigation';

export default function Dashboard() {
  const { isAuthenticated } = useAppSelector((state: RootState) =>
    selectAuth(state)
  );

  if (!isAuthenticated) {
    return redirect('/');
  } else {
    redirect('/dashboard/overview');
  }
}
