'use server';

import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import msgpack from 'msgpack-lite';

const postSchema = z.object({
  content: z.string().min(1).max(280),
  category: z.enum(['programming', 'nature', 'games', 'other']),
  imageUrl: z.string().url().optional().or(z.literal('')),
  linkUrl: z.string().url().optional().or(z.literal('')),
});

export async function createPost(data: z.infer<typeof postSchema>) {
  const validatedData = postSchema.safeParse(data);

  if (!validatedData.success) {
    throw new Error('Invalid post data.');
  }

  // In a real application, you would save this data to a database.
  // For now, we'll just log it to the console and save to a local file.
  console.log('New post created:', validatedData.data);
  
  const { category, ...postData } = validatedData.data;

  // This is a simplified example. In a real app, you'd have a proper DB
  // and likely not write to the filesystem from a serverless function.
  // The git repo info you provided is not used here as we cannot push to git.
  try {
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    const filePath = path.join(dataDir, `${category}.msgpack`);
    
    let posts = [];
    try {
      const fileContent = await fs.readFile(filePath);
      posts = msgpack.decode(fileContent);
    } catch (error) {
      // File probably doesn't exist, which is fine.
    }

    const newPost = {
      id: `post-${Date.now()}`,
      ...postData,
      // In a real app, author would come from the authenticated user session
      author: { id: 'user-5', name: 'You', username: 'currentuser' }, 
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
    };

    posts.push(newPost);
    
    const encodedData = msgpack.encode(posts);
    await fs.writeFile(filePath, encodedData);
    console.log(`Post saved to ${filePath}`);
  } catch (error) {
    console.error("Failed to save post to file", error);
    // We don't re-throw here so the user experience is not broken
    // if file system access fails.
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
