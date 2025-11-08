'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const postSchema = z.object({
  content: z.string().min(1, 'Post content cannot be empty.').max(280, 'Post content is too long.'),
  imageUrl: z.string().url('Please enter a valid image URL.').optional().or(z.literal('')),
  linkUrl: z.string().url('Please enter a valid link URL.').optional().or(z.literal('')),
});

type PostFormValues = z.infer<typeof postSchema>;

type PostFormProps = {
  createPostAction: (data: PostFormValues) => Promise<void>;
};

export function PostForm({ createPostAction }: PostFormProps) {
  const { toast } = useToast();
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: '',
      imageUrl: '',
      linkUrl: '',
    },
  });

  async function onSubmit(data: PostFormValues) {
    try {
      await createPostAction(data);
      toast({
        title: 'Post Created!',
        description: 'Your post has been successfully submitted.',
      });
      form.reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create post. Please try again.',
      });
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What's on your mind?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts with the world..."
                      className="min-h-[120px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="linkUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end gap-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
