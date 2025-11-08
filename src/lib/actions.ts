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

  let posts = [];
  let existingFileSha: string | undefined;

  try {
    // 1. Get the existing file to get its SHA and content
    const { data: fileData } = await axios.get(apiUrl, { headers });
    existingFileSha = fileData.sha;
    const buffer = Buffer.from(fileData.content, 'base64');
    const decompressed = await gunzip(buffer);
    posts = msgpack.decode(decompressed);
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      // File doesn't exist, which is fine. We will create it.
      console.log(`File ${filePath} not found. Creating a new one.`);
    } else {
      // Another error occurred
      console.error('Error fetching file from GitHub:', error.response?.data || error.message);
      throw new Error('Could not retrieve posts from the repository.');
    }
  }
  
  // 2. Add the new post
  const newPost = {
    id: `post-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    ...postData,
    author: { id: `user-current-${Date.now()}`, name: 'You', username: 'currentuser', avatarUrl: 'https://picsum.photos/seed/currentUser/200/200' },
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: 0,
    shares: 0,
  };

  posts.unshift(newPost); // Add to the beginning

  // 3. Encode, compress, and base64-encode the new content
  const encodedData = msgpack.encode(posts);
  const compressedData = await gzip(encodedData);
  const newContentBase64 = compressedData.toString('base64');

  // 4. Create or update the file in the GitHub repository
  try {
    await axios.put(
      apiUrl,
      {
        message: `feat: add post to ${category}`,
        content: newContentBase64,
        sha: existingFileSha, // Required for updates
        branch: 'main' // Or your default branch
      },
      { headers }
    );
    console.log(`Post successfully saved to GitHub repo: ${filePath}`);
  } catch (error: any) {
     console.error('Error saving file to GitHub:', error.response?.data || error.message);
     throw new Error('Could not save post to the repository.');
  }

  // We don't need a redirect here anymore, but a revalidation might be useful in the future.
  // For now, let's just confirm it worked.
}
