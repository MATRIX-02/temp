'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { loginUser, selectAuth } from '@/lib/store/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { ThemeProvider, useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';

const ALLOWED_EMAILS = [
  'mayank@easeworkai.com',
  'ratha@easeworkai.com',
  'aryan@easeworkai.com',
  'siddhant@easeworkai.com',
  'rajdeep@easeworkai.com'
];

const formSchema = z.object({
  email: z
    .string()
    .email()
    .endsWith('@easeworkai.com', {
      message: 'Email must end with @easeworkai.com'
    })
    .refine((email) => ALLOWED_EMAILS.includes(email), {
      message: 'Invalid email address'
    })
});

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
  const { isAuthenticated, error, loading, user } = useAppSelector(selectAuth);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    dispatch(loginUser(values.email));
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-900">
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute w-full h-full"
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
      <div className="relative z-10 w-full max-w-md p-6 space-y-8 shadow-xl rounded-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800 dark:text-gray-200">
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
          onClick={() => {
            toast({
              title: 'Microsoft Login',
              description: 'Microsoft login integration pending'
            });
          }}
        >
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 21 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 0H0V10H10V0Z" fill="#F25022" />
            <path d="M21 0H11V10H21V0Z" fill="#7FBA00" />
            <path d="M10 11H0V21H10V11Z" fill="#00A4EF" />
            <path d="M21 11H11V21H21V11Z" fill="#FFB900" />
          </svg>
          Login with Microsoft
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="yourname@easeworkai.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Test Login'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
