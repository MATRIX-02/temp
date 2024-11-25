'use client';

import { useEffect } from 'react';
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
  initiateLogin,
  selectAuth
} from '@/lib/store/features/auth/authSlice';

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

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard/overview');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error
      });
    }
  }, [error, toast]);

  const handleLogin = async () => {
    try {
      const result = await dispatch(initiateLogin()).unwrap();
      // The backend will handle the redirect to Microsoft's login page
      // You might need to handle the response data here if needed
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to initiate login'
      });
    }
  };

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

        <Button
          className="w-full bg-[#2F2F2F] text-white hover:bg-[#1F1F1F] dark:bg-purple-600 dark:text-gray-200 dark:hover:bg-purple-700"
          onClick={handleLogin}
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
      </div>
    </div>
  );
};
