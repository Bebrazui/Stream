'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import msgpack from 'msgpack-lite';
import { promisify } from 'util';
import zlib from 'zlib';
import axios from 'axios';
import { Post, User, Comment } from '@/types';
import { revalidatePath } from 'next/cache';

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

// ----- USER DATA ACTIONS (Unchanged) -----

// ...

// ----- POST DATA ACTIONS -----

async function getPostsByCategory(category: string): Promise<Post[]> {
    const filePath = `data/${category}.msgpack.gz`;
    const fileData = await getGitHubFile(filePath);

    if (!fileData) {
        return [];
    }

    try {
        const buffer = Buffer.from(fileData.content, 'base64');
        const decompressed = await gunzip(buffer);
        const posts = msgpack.decode(decompressed);

        // Data migration for each post within a category
        return posts.map((post: any) => {
            if (typeof post.comments === 'number' || !post.comments) {
                return {
                    ...post,
                    commentCount: post.comments || 0,
                    comments: [],
                };
            }
            return {
                ...post,
                commentCount: post.commentCount ?? post.comments.length,
            };
        });
    } catch (error) {
        console.error(`Error decoding posts for category ${category}:`, error);
        return [];
    }
}

export async function getPosts(): Promise<Post[]> {
    const categories = ['programming', 'nature', 'games', 'other'];
    const postPromises = categories.map(getPostsByCategory);
    const allPostsNested = await Promise.all(postPromises);
    const allPosts = allPostsNested.flat();

    allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return allPosts;
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

  const file = await getGitHubFile(filePath);
  if (file) {
      existingFileSha = file.sha;
      const buffer = Buffer.from(file.content, 'base64');
      const decompressed = await gunzip(buffer);
      posts = msgpack.decode(decompressed);
  }
  
  const newPost: Post = {
    id: `post-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    ...postData,
    author: { id: `user-current-${Date.now()}`, name: 'You', username: 'currentuser', avatarUrl: 'https://picsum.photos/seed/currentUser/200/200' },
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: [], // Correctly initialized as an empty array
    commentCount: 0, // Correctly initialized as 0
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

// ----- COMMENT DATA ACTIONS -----

export async function addComment(postId: string, text: string) {
    const { GITHUB_TOKEN, GITHUB_REPO_URL } = process.env;
    if (!GITHUB_TOKEN || !GITHUB_REPO_URL) {
        throw new Error('GitHub environment variables are not properly configured.');
    }

    const allPosts = await getPosts();
    const postIndex = allPosts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
        throw new Error('Post not found');
    }

    const post = allPosts[postIndex];
    // Simplified category extraction - assuming format `post-category-timestamp`
    const categoryMatch = post.id.match(/post-([^-]+)-/);
    if (!categoryMatch) {
        console.error('Could not determine category from post ID:', post.id);
        return; 
    }
    const category = categoryMatch[1];
    const filePath = `data/${category}.msgpack.gz`;

    const currentUser = { // Dummy user for now
        id: 'user-4', 
        name: 'You', 
        username: 'current_user', 
        avatarUrl: 'https://i.pravatar.cc/150?u=user-4'
    };

    const newComment: Comment = {
        id: `comment-${Date.now()}`,
        text,
        author: currentUser,
        createdAt: new Date().toISOString(),
    };

    // Ensure comments is an array before unshift
    if (!Array.isArray(post.comments)) {
        post.comments = [];
    }

    post.comments.unshift(newComment);
    post.commentCount = post.comments.length;

    // Get all posts for the specific category to update the file
    const categoryPosts = allPosts.filter(p => {
        const pCategoryMatch = p.id.match(/post-([^-]+)-/);
        return pCategoryMatch ? pCategoryMatch[1] === category : false;
    });

    await updateCategoryFile(filePath, categoryPosts);

    revalidatePath('/'); // Revalidate the home page to show the new comment
}

async function updateCategoryFile(filePath: string, posts: Post[]) {
    const { GITHUB_TOKEN, GITHUB_REPO_URL } = process.env;
    const { owner, repo } = parseGitHubUrl(GITHUB_REPO_URL!);
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    const file = await getGitHubFile(filePath);
    
    const encodedData = msgpack.encode(posts);
    const compressedData = await gzip(encodedData);
    const newContentBase64 = compressedData.toString('base64');

    await axios.put(apiUrl, {
        message: `feat: update comments in ${filePath}`,
        content: newContentBase64,
        sha: file?.sha,
        branch: 'main',
    }, { headers: { Authorization: `token ${GITHUB_TOKEN}` } });
}