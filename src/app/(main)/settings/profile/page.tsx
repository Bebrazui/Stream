
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/context/auth-context';
import { useToast } from "@/components/ui/use-toast";
import { updateProfile } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUploader } from '@/components/profile/image-uploader';
import { ThemeSelector } from '@/components/profile/theme-selector';
import { FrameSelector } from '@/components/profile/frame-selector';
import { useEffect } from 'react';

const THEMES = ['default', 'dark', 'ocean', 'sunrise', 'premium-galaxy'] as const;
const FRAMES = ['none', 'circle', 'gold-border', 'neon-glow', 'vintage'] as const;

// This schema is for client-side validation. It matches the server-side one.
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  bio: z.string().max(160, 'Bio must not be longer than 160 characters.').optional().default(''),
  avatarUrl: z.string().optional().default(''), // Can be a URL or base64 data
  bannerUrl: z.string().optional().default(''), // Can be a URL or base64 data
  profileTheme: z.enum(THEMES).default('default'),
  avatarFrame: z.enum(FRAMES).default('none'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const { user, login: authLogin } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    // Initialize with empty strings to guarantee controlled components from the very first render.
    defaultValues: {
        name: '',
        bio: '',
        avatarUrl: '',
        bannerUrl: '',
        profileTheme: 'default',
        avatarFrame: 'none',
    }
  });

  // When the `user` object is loaded from context, we reset the form
  // with the user's actual data. This is the correct pattern to populate
  // a form with asynchronously loaded data.
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || '',
        bannerUrl: user.bannerUrl || '',
        profileTheme: user.profileTheme || 'default',
        avatarFrame: user.avatarFrame || 'none',
      });
    }
  }, [user, form.reset]); // Dependency array ensures this runs only when user or reset function changes

  async function onSubmit(data: ProfileFormValues) {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to update your profile.", variant: "destructive" });
      return;
    }

    // The `data` object from react-hook-form contains all current form values.
    // We can pass this entire object to a FormData constructor.
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value) { // Append only if value is not null/undefined/empty string
            formData.append(key, value as string);
        }
    });

    try {
        const result = await updateProfile(formData, user);

        if (result.error) {
            toast({ title: "Update Failed", description: result.error, variant: "destructive" });
        } else if (result.success && result.user) {
          authLogin(result.user); // Update the user in our global context
          toast({ title: "Profile Updated", description: "Your changes have been saved successfully." });
          router.push(`/profile/${user.username}`); // Redirect to the public profile page
        }
    } catch (error) {
        console.error("Submit Error:", error);
        toast({ title: "Request Failed", description: "Could not send request to the server. Please try again.", variant: "destructive" });
    }
  }

  // Show a loading state while we wait for user data. This prevents the form
  // from rendering incorrectly or flashing.
  if (!user) {
    return <div className="container mx-auto max-w-4xl py-8 text-center">Loading Profile Editor...</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30">
          <CardTitle>Customize Your Profile</CardTitle>
          <CardDescription>Make your profile stand out. Your changes will be public.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your display name" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea placeholder="A short bio about yourself" className="resize-none" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              <Controller
                control={form.control}
                name="bannerUrl"
                render={({ field }) => (
                    <ImageUploader 
                        label="Banner Image" 
                        onUpload={field.onChange} 
                        initialImage={field.value}
                        className="aspect-[3/1]"
                    />
                )}
              />

              <Controller
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                     <ImageUploader 
                        label="Avatar" 
                        onUpload={field.onChange} 
                        initialImage={field.value} 
                        className="aspect-square w-48 mx-auto -mt-24 relative z-10"
                    />
                )}
              />
              
              <div className="space-y-4">
                  <Controller
                    control={form.control}
                    name="profileTheme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Theme</FormLabel>
                        <ThemeSelector value={field.value} onChange={field.onChange} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
              
              <div className="space-y-4">
                   <Controller
                    control={form.control}
                    name="avatarFrame"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avatar Frame</FormLabel>
                        <FrameSelector value={field.value} onChange={field.onChange} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              <div className="flex justify-end pt-6">
                <Button type="submit" size="lg" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
                  {form.formState.isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
