
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const commentFormSchema = z.object({
  text: z.string().min(1, "Comment can't be empty").max(280, "Comment is too long"),
});

// Mock user for the comment form avatar
const mockUser = {
    name: 'Alice',
    avatarUrl: 'https://i.pravatar.cc/150?u=alice'
}

type CommentFormValues = z.infer<typeof commentFormSchema>;

interface CommentFormProps {
  onSubmit: (values: CommentFormValues) => void;
  isSubmitting: boolean;
}

export function CommentForm({ onSubmit, isSubmitting }: CommentFormProps) {
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      text: '',
    },
  });

  const handleSubmit = (values: CommentFormValues) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex items-start gap-4 p-4 border-t border-white/20">
        <Avatar className="w-10 h-10 border-2 border-white/30 mt-1">
            <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
            <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Textarea
                  placeholder="Post your reply"
                  className="bg-transparent border-none focus-visible:ring-0 ring-offset-0 text-lg resize-none"
                  rows={1}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting || !form.formState.isValid} className="self-end">
          {isSubmitting ? 'Replying...' : 'Reply'}
        </Button>
      </form>
    </Form>
  );
}
