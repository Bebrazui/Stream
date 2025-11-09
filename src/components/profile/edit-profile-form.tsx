'use client';

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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { User } from '@/types';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  bio: z.string().max(160, 'Bio must not be longer than 160 characters.').optional(),
  avatarUrl: z.string().url('Please enter a valid URL.').optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type EditProfileFormProps = {
  user: { name: string; bio?: string; avatarUrl?: string };
  updateUserAction: (data: ProfileFormValues) => Promise<void>;
};

export function EditProfileForm({ user, updateUserAction }: EditProfileFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
        name: user.name || '',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || '',
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    try {
      await updateUserAction(data);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
      router.push('/profile/currentuser');
      router.refresh(); // Refresh to show the latest changes
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update your profile. Please try again.',
      });
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
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
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
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
