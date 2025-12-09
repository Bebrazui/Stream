'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { login, register } from '@/lib/actions';
import { useAuthModal } from '@/hooks/use-auth-modal';
import { useAuth } from '@/context/auth-context';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const authSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type AuthFormValues = z.infer<typeof authSchema>;

type AuthFormProps = {
  view: 'login' | 'register';
};

export function AuthForm({ view }: AuthFormProps) {
  const { toast } = useToast();
  const { setView, closeModal } = useAuthModal();
  const { refetchUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (data: AuthFormValues) => {
    setIsLoading(true);
    const action = view === 'login' ? login : register;
    const result = await action(data);

    if (result.success) {
      toast({
        title: view === 'login' ? 'Logged in successfully' : 'Account created successfully',
      });
      await refetchUser();
      closeModal();
    } else {
      toast({
        variant: 'destructive',
        title: `Error ${view === 'login' ? 'logging in' : 'registering'}`,
        description: result.error || 'An unknown error occurred.',
      });
    }
    setIsLoading(false);
  };
  
  const inputStyles = "bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:ring-sky-500 focus:border-sky-500";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-400">Username</FormLabel>
              <FormControl>
                <Input placeholder="Your username" {...field} className={inputStyles} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-400">Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input type={showPassword ? 'text' : 'password'} placeholder="Your password" {...field} className={cn("pr-10", inputStyles)} />
                </FormControl>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold text-base" disabled={isLoading}>
          {isLoading ? 'Processing...' : (view === 'login' ? 'Log In' : 'Register')}
        </Button>
        <p className="text-center text-sm text-slate-400 pt-4">
          {view === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => setView(view === 'login' ? 'register' : 'login')}
            className="font-medium text-sky-400 hover:text-sky-300 hover:underline focus:outline-none"
          >
            {view === 'login' ? 'Register' : 'Log In'}
          </button>
        </p>
      </form>
    </Form>
  );
}
