
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/auth-context';
import { updateProfile } from '@/lib/actions';
import { useState } from 'react';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50),
  bio: z.string().max(160, { message: "Bio cannot be more than 160 characters." }).optional(),
  avatarUrl: z.string().url({ message: "Please enter a valid URL." }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function EditProfileForm({ closeDialog }: { closeDialog: () => void }) {
  const { user, updateUser } = useAuth(); // Assume setUser is now available
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      avatarUrl: user?.avatarUrl || '',
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    const result = await updateProfile(formData);

    if ('success' in result && result.success && result.user) {
      if(updateUser) updateUser(result.user); // Update user in context
      toast({ title: "Success", description: "Profile updated successfully!" });
      closeDialog();
    } else if ('error' in result) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setIsSubmitting(false);
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
                <Textarea placeholder="Tell us a little about yourself" {...field} />
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
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
      </form>
    </Form>
  );
}

