'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import msgpack from 'msgpack-lite';
import { promisify } from 'util';
import zlib from 'zlib';
import axios from 'axios';
import { Post, User } from '@/types';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

// Common Zod schemas
const postSchema = z.object({
  content: z.string().min(1).max(280),
  category: z.enum(['programming', 'nature', 'games', 'other']),
  imageUrl: z.string().optional(),
});

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  bio: z.string().max(160, 'Bio must not be longer than 160 characters.').optional(),
  avatarUrl: z.string().url('Please enter a valid URL.').optional(),
});

// Helper function to parse GitHub URL
function parseGitHubUrl(url: string) {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) {
    throw new Error('Invalid GitHub repository URL format in .env.local. Should be like https://github.com/owner/repo');
  }
  const owner = match[1];
  const repo = match[2].replace(/\.git$/, ''); // Remove .git from the end
  return { owner, repo };
}

// Generalized function to get file content from GitHub
async function getGitHubFile(filePath: string) {
    const { GITHUB_TOKEN, GITHUB_REPO_URL } = process.env;
    if (!GITHUB_REPO_URL) {
        throw new Error('GitHub repo URL is not configured in .env');
    }
    const { owner, repo } = parseGitHubUrl(GITHUB_REPO_URL);
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    const headers = { Authorization: `token ${GITHUB_TOKEN}` };

    try {
        const { data } = await axios.get(apiUrl, { headers });
        return { content: data.content, sha: data.sha };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null; // File not found
        }
        throw error; // Rethrow other errors
    }
}

// ----- USER DATA ACTIONS -----

export async function getUsers(): Promise<User[]> {
    const fileData = await getGitHubFile('data/users.msgpack.gz');

    if (!fileData) {
        console.log('users.msgpack.gz not found. Returning empty array.');
        return [];
    }

    try {
        const buffer = Buffer.from(fileData.content, 'base64');
        const decompressed = await gunzip(buffer);
        return msgpack.decode(decompressed);
    } catch (error) {
        console.error('Error decoding user data:', error);
        return []; // Return empty on decoding error
    }
}

export async function updateUserProfile(data: z.infer<typeof profileSchema>): Promise<void> {
    const validatedData = profileSchema.safeParse(data);
    if (!validatedData.success) {
        throw new Error('Invalid profile data provided.');
    }

    const { GITHUB_TOKEN, GITHUB_REPO_URL } = process.env;
    if (!GITHUB_TOKEN || !GITHUB_REPO_URL) {
        throw new Error('GitHub environment variables are not configured.');
    }

    const { owner, repo } = parseGitHubUrl(GITHUB_REPO_URL);
    const filePath = 'data/users.msgpack.gz';
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    // Get existing users and file SHA
    const file = await getGitHubFile(filePath);
    let users: User[] = [];
    if (file) {
        const buffer = Buffer.from(file.content, 'base64');
        const decompressed = await gunzip(buffer);
        users = msgpack.decode(decompressed);
    }

    // Update or add the current user's profile
    const userIndex = users.findIndex(u => u.username === 'currentuser');
    if (userIndex > -1) {
        users[userIndex] = { ...users[userIndex], ...validatedData.data };
    } else {
        users.push({
            id: `user-current-${Date.now()}`,
            username: 'currentuser',
            ...validatedData.data,
            avatarUrl: validatedData.data.avatarUrl || 'https://picsum.photos/seed/currentUser/200/200',
        });
    }

    // Compress and encode the updated user list
    const encodedData = msgpack.encode(users);
    const compressedData = await gzip(encodedData);
    const newContentBase64 = compressedData.toString('base64');

    // Prepare and send the request to GitHub
    const headers = { Authorization: `token ${GITHUB_TOKEN}` };
    const payload = {
        message: 'feat: update user profile for currentuser',
        content: newContentBase64,
        sha: file?.sha, // Provide SHA to update the existing file
        branch: 'main',
    };

    await axios.put(apiUrl, payload, { headers });
    console.log('User profile successfully updated in GitHub repo.');
}


// ----- POST DATA ACTIONS -----

export async function getPosts(): Promise<Post[]> {
    const { GITHUB_TOKEN, GITHUB_REPO_URL } = process.env;

    if (!GITHUB_REPO_URL) {
        throw new Error('GitHub repo URL is not configured in .env');
    }

    const { owner, repo } = parseGitHubUrl(GITHUB_REPO_URL);
    const dataUrl = `https://api.github.com/repos/${owner}/${repo}/contents/data`;

    try {
        const { data: files } = await axios.get(dataUrl, {
            headers: GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {},
        });

        if (!Array.isArray(files)) {
            console.log('No posts found or data directory is not a directory.');
            return [];
        }

        const postPromises = files
            .filter(file => file.name.endsWith('.msgpack.gz') && file.name !== 'users.msgpack.gz')
            .map(async (file) => {
                const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${file.path}`;
                try {
                    const { data: rawContent } = await axios.get(rawUrl, { responseType: 'arraybuffer' });
                    const decompressed = await gunzip(Buffer.from(rawContent));
                    return msgpack.decode(decompressed);
                } catch (error) {
                    console.error(`Error processing file ${file.name} from ${rawUrl}:`, error);
                    return [];
                }
            });

        const allPostsNested = await Promise.all(postPromises);
        const allPosts = allPostsNested.flat();

        allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return allPosts;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.log('Data directory not found. Returning empty posts array.')
            return [];
        }
        console.error('Error fetching posts list from GitHub:', error);
        throw new Error('Failed to fetch posts.');
    }
}

export async function createPost(data: z.infer<typeof postSchema>) {
  const validatedData = postSchema.safeParse(data);

  if (!validatedData.success) {
    throw new Error('Invalid post data.');
  }

  const { GITHUB_TOKEN, GITHUB_REPO_URL } = process.env;

  if (!GITHUB_TOKEN || !GITHUB_REPO_URL) {
    throw new Error('GITHUB_TOKEN or GITHUB_REPO_URL is not configured in .env.local. Please add them.');
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
}
