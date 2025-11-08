'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import msgpack from 'msgpack-lite';
import { promisify } from 'util';
import zlib from 'zlib';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

const postSchema = z.object({
  content: z.string().min(1).max(280),
  category: z.enum(['programming', 'nature', 'games', 'other']),
  imageUrl: z.string().optional(),
});

export async function createPost(data: z.infer<typeof postSchema>) {
  const validatedData = postSchema.safeParse(data);

  if (!validatedData.success) {
    throw new Error('Invalid post data.');
  }

  console.log('New post created:', validatedData.data);
  
  const { category, ...postData } = validatedData.data;

  try {
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    const filePath = path.join(dataDir, `${category}.msgpack.gz`);
    
    let posts = [];
    try {
      const fileContent = await fs.readFile(filePath);
      const decompressed = await gunzip(fileContent);
      posts = msgpack.decode(decompressed);
    } catch (error) {
      // File probably doesn't exist, which is fine.
    }

    const newPost = {
      id: `post-${Date.now()}-${Math.random()}`,
      ...postData,
      author: { id: `user-current-${Date.now()}`, name: 'You', username: 'currentuser', avatarUrl: 'https://picsum.photos/seed/currentUser/200/200' }, 
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
    };

    posts.unshift(newPost); // Add to the beginning
    
    const encodedData = msgpack.encode(posts);
    const compressedData = await gzip(encodedData);
    await fs.writeFile(filePath, compressedData);

    console.log(`Post saved to ${filePath}`);
  } catch (error) {
    console.error("Failed to save post to file", error);
    // We don't re-throw here so the user experience is not broken
    // if file system access fails.
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
