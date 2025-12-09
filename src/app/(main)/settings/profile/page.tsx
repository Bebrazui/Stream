'use client';

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { updateProfile } from "@/lib/actions";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(30, { message: "Name must not be longer than 30 characters." }),
  bio: z.string().max(160).optional(),
  avatarUrl: z.string().url({ message: "Please enter a valid URL." }).optional(),
  bannerUrl: z.string().url({ message: "Please enter a valid URL." }).optional(),
  profileTheme: z.enum(['default', 'dark', 'ocean', 'sunrise', 'premium-galaxy']).optional(),
  avatarFrame: z.enum(['none', 'circle', 'gold-border', 'neon-glow', 'vintage']).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const { user, logout } = useAuth(); // <-- Используем logout из AuthContext
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      bio: "",
      avatarUrl: "",
      bannerUrl: "",
      profileTheme: 'default',
      avatarFrame: 'none',
    },
    mode: "onChange",
  });

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
  }, [user, form.reset]);

  async function onSubmit(data: ProfileFormValues) {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to update your profile.", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    try {
      const result = await updateProfile(formData);

      if (result.error) {
        toast({ title: "Update Failed", description: result.error, variant: "destructive" });
      } else {
        toast({ title: "Profile Updated", description: "Your profile has been updated successfully." });
      }
    } catch (error) {
      toast({ title: "An Unexpected Error Occurred", description: "Please try again later.", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* ... (поля формы остаются без изменений) ... */}
          <FormField
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={field.value} alt={form.getValues("name")} />
                    <AvatarFallback>{form.getValues("name")?.[0]}</AvatarFallback>
                  </Avatar>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.png" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name. It can be your real name or a pseudonym.
                </FormDescription>
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
                <FormDescription>
                  You can <span>@mention</span> other users and organizations to link to them.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="profileTheme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Theme</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theme for your profile" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="ocean">Ocean</SelectItem>
                    <SelectItem value="sunrise">Sunrise</SelectItem>
                    <SelectItem value="premium-galaxy" disabled>Galaxy (Premium)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Customize the look of your profile page.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update profile</Button>
        </form>
      </Form>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">
          This action will log you out and require you to log back in.
        </p>
        {/* Используем onClick для вызова функции logout из контекста */}
        <Button variant="destructive" onClick={logout}>Log Out</Button>
      </div>

    </div>
  )
}
