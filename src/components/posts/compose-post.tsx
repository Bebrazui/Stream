
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createPost } from '@/lib/actions';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

const postSchema = z.object({
  content: z.string().min(1, "Post can't be empty.").max(280, "Post can't be longer than 280 characters."),
  // category and imageUrl are optional and handled separately
});

export default function ComposePost() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof postSchema>) => {
    if (!user) {
        toast({ title: "Error", description: "You must be logged in to post.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    try {
        const postData = {
            ...values,
            category: 'other' as const, // Default category
        };
        const result = await createPost(postData);
        if (result.error) {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        } else {
            toast({ title: "Success", description: "Post created!" });
            form.reset();
        }
    } catch (error) {
        toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!user) {
    return null; // Don't render the component if the user is not logged in
  }

  return (
    <div className="flex items-start space-x-4 p-4 border-b">
      <Avatar>
        <AvatarImage src={user.avatarUrl} alt={user.name} />
        <AvatarFallback>{user.name?.[0]}</AvatarFallback>
      </Avatar>
      <div className="w-full">
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Textarea
                {...form.register("content")}
                placeholder="What's happening?"
                className="w-full border-none focus:ring-0 resize-none text-lg"
                rows={3}
            />
            {form.formState.errors.content && <p className="text-red-500 text-sm mt-1">{form.formState.errors.content.message}</p>}
            <div className="flex justify-end mt-2">
                <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
                    {isSubmitting ? 'Posting...' : 'Post'}
                </Button>
            </div>
        </form>
      </div>
    </div>
  );
}
