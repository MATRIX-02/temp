'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useCheckAuthQuery } from '@/lib/store/features/auth/authApi';
import { useEffect } from 'react';

const BASE_URL = process.env.NEXT_AUTH_URL;

export default function SignInView() {
  const router = useRouter();
  const { data: auth, isLoading } = useCheckAuthQuery();

  useEffect(() => {
    if (auth?.user) {
      router.push('/dashboard/overview');
    }
  }, [auth, router]);

  const loginWithMicrosoft = () => {
    window.location.href = `${BASE_URL}/auth/microsoft/login`;
  };

  const loginWithGoogle = () => {
    window.location.href = `${BASE_URL}/auth/google/login`;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-white to-purple-50 p-4 dark:from-gray-900 dark:to-purple-900">
      <div className="relative z-10 w-full max-w-md space-y-8 rounded-xl bg-white/80 p-6 shadow-xl backdrop-blur-sm dark:bg-gray-800/90">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-900 dark:text-purple-400">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Please sign in to continue
          </p>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full bg-[#2F2F2F] text-white hover:bg-[#1F1F1F] dark:hover:bg-[#3F3F3F]"
            onClick={loginWithMicrosoft}
          >
            <svg
              className="mr-2 h-5 w-5"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 0H0V10H10V0Z" fill="#F25022" />
              <path d="M21 0H11V10H21V0Z" fill="#7FBA00" />
              <path d="M10 11H0V21H10V11Z" fill="#00A4EF" />
              <path d="M21 11H11V21H21V11Z" fill="#FFB900" />
            </svg>
            Sign in with Microsoft
          </Button>

          <Button
            className="w-full border border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
            onClick={loginWithGoogle}
          >
            <svg
              className="mr-2 h-5 w-5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
