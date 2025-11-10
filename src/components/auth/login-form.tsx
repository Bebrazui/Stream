'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from '@/context/auth-context';
import { login } from '@/lib/actions';
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters."),
    password: z.string().min(6, "Password must be at least 6 characters."),
});

export function LoginForm() {
  console.log("LoginForm component rendered."); // Log 1: Check if component renders

  const { login: authLogin } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("onSubmit function called with values:", values); // Log 2: Check if submit handler is called
    try {
        console.log("Calling server action 'login'...");
        const result = await login(values);
        console.log("Server action 'login' returned:", result);

        if (result.error) {
            toast({ 
                title: "Login Failed",
                description: result.error, 
                variant: "destructive",
            });
        } else if (result.success && result.user) {
            authLogin(result.user);
            toast({
                title: "Login Successful",
                description: "Welcome back!",
            });
        }
    } catch (error) {
        console.error("Login Submit Error:", error); // Log 3: Catch any unexpected errors
        toast({
            title: "An Unexpected Error Occurred",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  )
}
