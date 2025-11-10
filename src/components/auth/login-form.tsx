'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/context/auth-context';
import { login } from '@/lib/actions';
import { useToast } from "@/components/ui/use-toast";
import { MathCaptcha } from './math-captcha'; // Import our new component

const formSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    captchaAnswer: z.string().min(1, "Please answer the security question."),
    captchaToken: z.string().min(1, "CAPTCHA token is missing."),
});

export function LoginForm() {
  const { login: authLogin } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      captchaAnswer: "",
      captchaToken: "", // This will be populated by the MathCaptcha component
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        const result = await login(values);

        if (result.error) {
            toast({ 
                title: "Login Failed",
                description: result.error, 
                variant: "destructive",
            });
            // We might want to refresh the captcha on failure
            // This part is a bit more complex as it requires triggering a state change in the child
        } else if (result.success && result.user) {
            authLogin(result.user);
            toast({
                title: "Login Successful",
                description: "Welcome back!",
            });
        }
    } catch (error) {
        console.error("Login Submit Error:", error);
        toast({
            title: "An Unexpected Error Occurred",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
        });
    }
  }

  return (
    // FormProvider is needed for the nested MathCaptcha to access the form context
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="your_username" {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Add our custom captcha component */}
        <MathCaptcha />

        <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  )
}
