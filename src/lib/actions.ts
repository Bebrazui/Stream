'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import axios from 'axios';
import crypto from 'crypto';
import { promisify } from 'util';
import zlib from 'zlib';
import msgpack from 'msgpack-lite';
import { Post, User, Comment, UserCredentials } from '@/types';

// Environment variables validation
const {
    GITHUB_TOKEN,
    GITHUB_REPO_URL,
    GITHUB_ACCOUNTS_REPO_URL,
    CRYPTO_SECRET_KEY
} = process.env;

if (!GITHUB_TOKEN || !GITHUB_REPO_URL || !GITHUB_ACCOUNTS_REPO_URL || !CRYPTO_SECRET_KEY) {
    throw new Error('Missing one or more critical environment variables. Please check GITHUB_TOKEN, GITHUB_REPO_URL, GITHUB_ACCOUNTS_REPO_URL, and CRYPTO_SECRET_KEY.');
}

if (CRYPTO_SECRET_KEY.length !== 64) {
    throw new Error('CRYPTO_SECRET_KEY must be a 64-character hex string (32 bytes).');
}

// --- Zod Schemas ---
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

const authSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters."),
    password: z.string().min(6, "Password must be at least 6 characters."),
});


// --- Utilities (Compression, Encryption, GitHub) ---
const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);
const ENCRYPTION_KEY = Buffer.from(CRYPTO_SECRET_KEY, 'hex');
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

function parseGitHubUrl(url: string) {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) throw new Error(`Invalid GitHub repository URL format: ${url}`);
    return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

async function getGitHubFile(url: string, filePath: string) {
    const { owner, repo } = parseGitHubUrl(url);
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    try {
        const { data } = await axios.get(apiUrl, { 
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });
        return { content: data.content, sha: data.sha };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) return null;
        throw error;
    }
}

async function updateGitHubFile(url: string, filePath: string, content: Buffer, sha?: string) {
    const { owner, repo } = parseGitHubUrl(url);
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    await axios.put(apiUrl, {
        message: `feat: update ${filePath}`,
        content: content.toString('base64'),
        sha, 
        branch: 'main'
    }, { 
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
}

function encrypt(data: Buffer): Buffer {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return Buffer.concat([iv, authTag, encrypted]);
}

function decrypt(data: Buffer): Buffer {
    const iv = data.subarray(0, IV_LENGTH);
    const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
    const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]);
}

// --- User & Auth Actions ---
const ACCOUNTS_FILE_PATH = 'accounts.msgpack.gz.enc';

async function getAccounts(): Promise<{ accounts: UserCredentials[], sha?: string }> {
    const file = await getGitHubFile(GITHUB_ACCOUNTS_REPO_URL!, ACCOUNTS_FILE_PATH);
    if (!file) return { accounts: [] };

    const encryptedBuffer = Buffer.from(file.content, 'base64');
    const decryptedBuffer = decrypt(encryptedBuffer);
    const decompressedBuffer = await gunzip(decryptedBuffer);
    const accounts = msgpack.decode(decompressedBuffer);
    return { accounts, sha: file.sha };
}

async function saveAccounts(accounts: UserCredentials[], sha?: string) {
    const packed = msgpack.encode(accounts);
    const compressed = await gzip(packed);
    const encrypted = encrypt(compressed);
    await updateGitHubFile(GITHUB_ACCOUNTS_REPO_URL!, ACCOUNTS_FILE_PATH, encrypted, sha);
}

export async function register(data: z.infer<typeof authSchema>) {
    const validated = authSchema.safeParse(data);
    if (!validated.success) {
        return { error: "Invalid data. " + validated.error.flatten().fieldErrors };
    }
    const { username, password } = validated.data;

    const { accounts, sha } = await getAccounts();
    if (accounts.find(u => u.username === username)) {
        return { error: "Username already exists." };
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = (await promisify(crypto.pbkdf2)(password, salt, 100000, 64, 'sha512')).toString('hex');
    
    const newUser: UserCredentials = {
        id: `user-${crypto.randomUUID()}`,
        username,
        hashedPassword: `${salt}:${hashedPassword}`,
        name: username,
        avatarUrl: `https://i.pravatar.cc/150?u=${username}`,
        bio: "",
        followers: 0,
        following: 0,
    };

    accounts.push(newUser);
    await saveAccounts(accounts, sha);

    return { success: true, user: { username, name: newUser.name, avatarUrl: newUser.avatarUrl, bio: newUser.bio } };
}

export async function login(data: z.infer<typeof authSchema>) {
    const validated = authSchema.safeParse(data);
    if (!validated.success) {
        return { error: "Invalid data." };
    }
    const { username, password } = validated.data;
    
    const { accounts } = await getAccounts();
    const user = accounts.find(u => u.username === username);
    if (!user) {
        return { error: "Invalid username or password." };
    }

    const [salt, storedHash] = user.hashedPassword.split(':');
    const hash = (await promisify(crypto.pbkdf2)(password, salt, 100000, 64, 'sha512')).toString('hex');

    if (hash !== storedHash) {
        return { error: "Invalid username or password." };
    }

    const { hashedPassword, ...userProfile } = user;
    return { success: true, user: userProfile };
}

// --- Public Profile & Post Actions (Modified for public/private data) ---

export async function getSuggestedUsers(currentUsername?: string): Promise<User[]> {
    const { accounts } = await getAccounts();
    // Exclude current user and remove sensitive data
    const suggested = accounts
        .filter(u => u.username !== currentUsername)
        .map(({ hashedPassword, ...user }) => user);
    return suggested.slice(0, 5); // Return top 5 suggestions
}

export async function getUserByUsername(username: string): Promise<User | null> {
    if (username === 'currentuser') { // Temporary handler for guest/demo user
        return { id: `user-current-16927837433`, name: 'Guest User', username: 'currentuser', avatarUrl: 'https://picsum.photos/seed/currentUser/200/200', posts:[] };
    }
    const { accounts } = await getAccounts();
    const user = accounts.find(u => u.username === username);
    if (!user) return null;

    const userPosts = await getPosts();
    const { hashedPassword, ...userProfile } = user;

    return { ...userProfile, posts: userPosts.filter(p => p.author.username === username) };
}

export async function getPosts(): Promise<Post[]> {
    const categories = ['programming', 'nature', 'games', 'other'];
    const postPromises = categories.map(getPostsByCategory);
    const allPostsNested = await Promise.all(postPromises);
    const allPosts = allPostsNested.flat();
    allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return allPosts;
}

async function getPostsByCategory(category: string): Promise<Post[]> {
    const filePath = `data/${category}.msgpack.gz`;
    const fileData = await getGitHubFile(GITHUB_REPO_URL!, filePath);
    if (!fileData) return [];
    try {
        const buffer = Buffer.from(fileData.content, 'base64');
        const decompressed = await gunzip(buffer);
        const posts = msgpack.decode(decompressed);
        return posts.map((post: any) => ({ // Basic migration/validation
            ...post,
            commentCount: post.commentCount ?? (post.comments?.length || 0),
            comments: post.comments || [],
        }));
    } catch (error) {
        console.error(`Error decoding posts for category ${category}:`, error);
        return [];
    }
}

// The actions below need to be called with an authenticated user context.
// This will be handled client-side by checking IndexedDB.

export async function createPost(data: z.infer<typeof postSchema>, author: User) {
  if (!author) return { error: "Authentication required." };

  // (Implementation is the same as before, just uses the passed author object)
  const { owner, repo } = parseGitHubUrl(GITHUB_REPO_URL!);
  const { category, ...postData } = data;
  const filePath = `data/${category}.msgpack.gz`;
  const file = await getGitHubFile(GITHUB_REPO_URL!, filePath);
  
  let posts: any[] = [];
  if (file) {
      const buffer = Buffer.from(file.content, 'base64');
      const decompressed = await gunzip(buffer);
      posts = msgpack.decode(decompressed);
  }
  
  const newPost: Post = {
    id: `post-${category}-${Date.now()}`,
    ...postData,
    author: { id: author.id, name: author.name, username: author.username, avatarUrl: author.avatarUrl },
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: [],
    commentCount: 0,
    shares: 0,
  };

  posts.unshift(newPost);

  const encodedData = msgpack.encode(posts);
  const compressedData = await gzip(encodedData);
  
  await updateGitHubFile(GITHUB_REPO_URL!, filePath, compressedData, file?.sha);
  revalidatePath('/');
  return { success: true };
}

export async function addComment(postId: string, text: string, author: User) {
    if (!author) return { error: "Authentication required." };

    const allPosts = await getPosts();
    const postIndex = allPosts.findIndex(p => p.id === postId);
    if (postIndex === -1) throw new Error('Post not found');

    const post = allPosts[postIndex];
    const categoryMatch = post.id.match(/post-([^-]+)-/);
    if (!categoryMatch) throw new Error('Could not determine category from post ID');
    const category = categoryMatch[1];
    
    const newComment: Comment = {
        id: `comment-${Date.now()}`,
        text,
        author,
        createdAt: new Date().toISOString(),
    };

    if (!Array.isArray(post.comments)) post.comments = [];
    post.comments.unshift(newComment);
    post.commentCount = post.comments.length;

    const categoryPosts = allPosts.filter(p => {
        const pCategoryMatch = p.id.match(/post-([^-]+)-/);
        return pCategoryMatch ? pCategoryMatch[1] === category : false;
    });
    const postToUpdate = categoryPosts.find(p => p.id === postId);
    if (postToUpdate) Object.assign(postToUpdate, post);

    const filePath = `data/${category}.msgpack.gz`;
    const file = await getGitHubFile(GITHUB_REPO_URL!, filePath);
    const encodedData = msgpack.encode(categoryPosts);
    const compressedData = await gzip(encodedData);
    
    await updateGitHubFile(GITHUB_REPO_URL!, filePath, compressedData, file?.sha);
    revalidatePath('/');
    return { success: true };
}

export async function updateProfile(formData: FormData, user: User) {
  if (!user) {
    return { error: 'Authentication required.' };
  }

  const data = Object.fromEntries(formData.entries());
  const validated = profileSchema.safeParse(data);

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  const { accounts, sha } = await getAccounts();
  const userIndex = accounts.findIndex(u => u.username === user.username);

  if (userIndex === -1) {
    return { error: 'User not found.' };
  }

  // Update only the fields that are present in validated.data
  Object.assign(accounts[userIndex], validated.data);

  await saveAccounts(accounts, sha);
  revalidatePath(`/profile/${user.username}`);
  return { success: true, user: { ...user, ...validated.data } };
}
