'use client';

import {
  useCheckAuthQuery,
  useLogoutMutation
} from '../store/features/auth/authApi';
import { useRouter } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_AUTH;

export const useAuth = () => {
  const router = useRouter();
  const { data: auth, isLoading } = useCheckAuthQuery();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const loginWithMicrosoft = () => {
    window.location.href = `${BASE_URL}/auth/microsoft/login`;
  };

  const loginWithGoogle = () => {
    window.location.href = `${BASE_URL}/auth/google/login`;
  };

  return {
    user: auth?.user,
    isAuthenticated: !!auth?.user,
    isLoading,
    logout: handleLogout,
    loginWithMicrosoft,
    loginWithGoogle
  };
};
