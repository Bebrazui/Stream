'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { PostCategory } from '@/types';
import { Upload, X } from 'lucide-react';

const postSchema = z.object({
  content: z.string().min(1, 'Post content cannot be empty.').max(280, 'Post content is too long.'),
  category: z.enum(['programming', 'nature', 'games', 'other']),
  imageUrl: z.string().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

type PostFormProps = {
  createPostAction: (data: PostFormValues) => Promise<void>;
};

const categories: { value: PostCategory; label: string }[] = [
    { value: 'programming', label: 'Programming' },
    { value: 'nature', label: 'Nature' },
    { value: 'games', label: 'Games' },
    { value: 'other', label: 'Other' },
];

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/webp', 0.8);
        resolve(dataUrl);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

export function PostForm({ createPostAction }: PostFormProps) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: '',
      category: 'other',
      imageUrl: '',
    },
  });

  const handleFileChange = async (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      try {
        const compressedBase64 = await compressImage(file);
        form.setValue('imageUrl', compressedBase64);
        setImagePreview(compressedBase64);
      } catch (error) {
        console.error("Image compression failed:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to process image. Please try another one.',
        });
      }
    } else if (file) {
      toast({
        variant: 'destructive',
        title: 'Invalid File',
        description: 'Please select an image file.',
      });
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const clearImage = () => {
    form.setValue('imageUrl', '');
    setImagePreview(null);
  }

  async function onSubmit(data: PostFormValues) {
    try {
      await createPostAction(data);
      toast({
        title: 'Post Created!',
        description: 'Your post has been successfully submitted.',
      });
      form.reset();
      setImagePreview(null);
    } catch (error: any) {
      const description =
        error.response?.data?.message ||
        error.message ||
        'An unknown error occurred.';

      toast({
        variant: 'destructive',
        title: 'Failed to create post',
        description: description,
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
                  <FormLabel>Image (Optional)</FormLabel>
                  <FormControl>
                    <div>
                      <div
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        className={`relative flex min-h-[150px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                          isDragging ? 'border-primary bg-accent' : 'border-input'
                        }`}
                      >
                         <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                          />
                        {imagePreview ? (
                          <>
                           <Image
                              src={imagePreview}
                              alt="Image preview"
                              fill
                              className="rounded-lg object-contain p-2"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute right-2 top-2 z-10 h-6 w-6"
                              onClick={clearImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
                            <Upload className="h-8 w-8" />
                            <p>Drag & drop an image here, or click to select a file</p>
                            <p className="text-xs">Compressed to WebP format</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
