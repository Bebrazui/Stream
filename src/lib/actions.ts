'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import msgpack from 'msgpack-lite';
import { promisify } from 'util';
import zlib from 'zlib';
import axios from 'axios';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

const postSchema = z.object({
  content: z.string().min(1).max(280),
  category: z.enum(['programming', 'nature', 'games', 'other']),
  imageUrl: z.string().optional(),
});

// Helper function to parse GitHub URL
function parseGitHubUrl(url: string) {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?/);
  if (!match) {
    throw new Error('Invalid GitHub repository URL');
  }
  return { owner: match[1], repo: match[2] };
}

export async function createPost(data: z.infer<typeof postSchema>) {
  const validatedData = postSchema.safeParse(data);

  if (!validatedData.success) {
    throw new Error('Invalid post data.');
  }

  const { GITHUB_TOKEN, GITHUB_REPO_URL } = process.env;

  if (!GITHUB_TOKEN || !GITHUB_REPO_URL) {
    console.error('GitHub token or repo URL is not configured in .env');
    throw new Error('Server is not configured for publishing posts.');
  }

  const { owner, repo } = parseGitHubUrl(GITHUB_REPO_URL);
  const { category, ...postData } = validatedData.data;
  const filePath = `data/${category}.msgpack.gz`;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  const headers = {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  };

  let posts: any[] = [];
  let existingFileSha: string | undefined;

  try {
    const { data: fileData } = await axios.get(apiUrl, { headers });
    existingFileSha = fileData.sha;
    const buffer = Buffer.from(fileData.content, 'base64');
    const decompressed = await gunzip(buffer);
    posts = msgpack.decode(decompressed);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.log(`File ${filePath} not found. A new one will be created.`);
      existingFileSha = undefined;
    } else {
      console.error('Error fetching file from GitHub:', error);
      throw error; 
    }
  }
  
  const newPost = {
    id: `post-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    ...postData,
    author: { id: `user-current-${Date.now()}`, name: 'You', username: 'currentuser', avatarUrl: 'https://picsum.photos/seed/currentUser/200/200' },
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: 0,
    shares: 0,
  };

  posts.unshift(newPost); 

  const encodedData = msgpack.encode(posts);
  const compressedData = await gzip(encodedData);
  const newContentBase64 = compressedData.toString('base64');

  try {
    await axios.put(
      apiUrl,
      {
        message: `feat: add post to ${category}`,
        content: newContentBase64,
        sha: existingFileSha,
        branch: 'main'
      },
      { headers }
    );
    console.log(`Post successfully saved to GitHub repo: ${filePath}`);
  } catch (error) {
     console.error('Error saving file to GitHub:', error);
     throw error;
  }
}
