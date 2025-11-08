'use server';

import { z } from 'zod';

const postSchema = z.object({
  content: z.string().min(1).max(280),
  imageUrl: z.string().url().optional().or(z.literal('')),
  linkUrl: z.string().url().optional().or(z.literal('')),
});

export async function createPost(data: z.infer<typeof postSchema>) {
  const validatedData = postSchema.safeParse(data);

  if (!validatedData.success) {
    throw new Error('Invalid post data.');
  }

  // In a real application, you would save this data to a database.
  // For now, we'll just log it to the console.
  console.log('New post created:', validatedData.data);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
