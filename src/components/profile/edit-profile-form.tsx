'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { updateProfile } from '@/lib/actions';
import { User } from '@/types';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useState } from 'react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  bio: z.string().max(160, 'Bio must not be longer than 160 characters.').optional(),
  avatarUrl: z.string().url('Please enter a valid URL.').optional(),
});

type EditProfileFormProps = {
  user: User;
};

export function EditProfileForm({ user }: EditProfileFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { setUser } = useAuth(); // Get setUser to update context
  const [isSubmitting, setIsSubmitting] = useState(false);


  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || '',
      bio: user.bio || '',
      avatarUrl: user.avatarUrl || '',
    },
  });

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('bio', values.bio || '');
    formData.append('avatarUrl', values.avatarUrl || '');

    try {
      const result = await updateProfile(formData, user);
      if (result.success && result.user) {
        toast({ title: 'Profile Updated', description: 'Your profile has been successfully updated.' });
        setUser(result.user); // Update the user in the context
        router.push(`/profile/${user.username}`); // Redirect to profile page
      } else {
        throw new Error(result.error ? JSON.stringify(result.error) : 'An unknown error occurred');
      }
    } catch (error) {
      console.error('Update failed:', error);
      toast({ title: 'Update Failed', description: `An error occurred: ${error instanceof Error ? error.message : String(error)}`, variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/avatar.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us a little about yourself" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
