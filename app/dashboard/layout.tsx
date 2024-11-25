'use client';

import AppSidebar from '@/components/layout/app-sidebar';
import { useCheckAuthQuery } from '@/lib/store/features/auth/authApi';
// import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

// export const metadata: Metadata = {
//   title: 'Easework AI Dashboard',
//   description: 'Easework AI Dashboard'
// };

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { data: auth, isLoading } = useCheckAuthQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!auth?.user) {
    redirect('/');
  }
  return (
    <>
      <AppSidebar>{children}</AppSidebar>
    </>
  );
}
