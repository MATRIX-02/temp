'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ThemeProvider, useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  checkAuthStatus,
  initiateMicrosoftLogin,
  initiateGoogleLogin,
  selectAuth
} from '@/lib/store/features/auth/authSlice';
import { LoadingScreen } from '@/components/layout/loading';

export default function LoginPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
      <LoginPageContent />
    </ThemeProvider>
  );
}

const LoginPageContent = () => {
  const { theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, error } = useAppSelector(selectAuth);
  const router = useRouter();
  const { toast } = useToast();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      await dispatch(checkAuthStatus());
      setAuthChecked(true);
    };
    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    if (authChecked && isAuthenticated) {
      router.replace('/dashboard/overview');
    }
  }, [isAuthenticated, authChecked, router]);

  if (!authChecked || loading) {
    return <LoadingScreen />;
  }

  const handleMicrosoftLogin = async () => {
    try {
      await dispatch(initiateMicrosoftLogin()).unwrap();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to initiate Microsoft login'
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await dispatch(initiateGoogleLogin()).unwrap();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to initiate Google login'
      });
    }
  };

  if (authChecked && !isAuthenticated) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-white to-purple-50 p-4 dark:from-gray-900 dark:to-purple-900">
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0,50 Q25,45 50,50 T100,50 V100 H0 Z"
              className="fill-purple-100/50 dark:fill-purple-800/50"
            />
            <path
              d="M0,70 Q25,65 50,70 T100,70 V100 H0 Z"
              className="fill-purple-200/30 dark:fill-purple-700/30"
            />
          </svg>
        </div>
        <div className="absolute right-5 top-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="relative z-10 w-full max-w-md space-y-8 rounded-xl bg-white/80 p-6 shadow-xl backdrop-blur-sm dark:bg-gray-800 dark:text-gray-200">
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
              className="w-full bg-[#2F2F2F] text-white hover:bg-[#1F1F1F] dark:bg-purple-600 dark:text-gray-200 dark:hover:bg-purple-700"
              onClick={handleMicrosoftLogin}
              disabled={loading}
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
              {loading ? 'Signing in...' : 'Login with Microsoft'}
            </Button>

            <Button
              className="w-full bg-white text-gray-900 hover:bg-gray-100 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              onClick={handleGoogleLogin}
              disabled={loading}
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
              {loading ? 'Signing in...' : 'Login with Google'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
