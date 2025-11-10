
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
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from '@/context/auth-context';
import { createCommunity } from '@/lib/actions';
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
    name: z.string().min(3, "Community name must be at least 3 characters.").max(21, "Community name must be less than 21 characters."),
    description: z.string().max(500, "Description must be less than 500 characters.").optional(),
});

export function CreateCommunityForm() {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({ 
            title: "Authentication Error",
            description: "You must be logged in to create a community.", 
            variant: "destructive",
        });
        return;
    }

    const result = await createCommunity(values, user);
    if (result.error) {
      toast({ 
        title: "Creation Failed",
        description: result.error, 
        variant: "destructive",
      });
    } else if (result.success && result.community) {
      toast({
        title: "Community Created!",
        description: `r/${result.community.name} has been successfully created.`,
      });
      // TODO: Close the modal and redirect to the new community page
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Community Name</FormLabel>
              <FormControl>
                <Input placeholder="r/your_community" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about your community" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating..." : "Create Community"}
        </Button>
      </form>
    </Form>
  )
}
