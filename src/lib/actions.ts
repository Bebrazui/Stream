'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Post, User } from '@/types';
import { getSession, createSession, getSessionUser, deleteSession, updateSession } from '@/lib/session';
import axios from 'axios';
import { randomUUID } from 'crypto';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO_URL = process.env.GITHUB_REPO_URL;

// --- Zod Schemas ---
const postSchema = z.object({
  content: z.string().min(1).max(280),
  category: z.enum(['programming', 'nature', 'games', 'other']),
  imageUrl: z.string().optional(),
});

const authSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters."),
    password: z.string().min(6, "Password must be at least 6 characters."),
});

// --- User & Auth ---

export async function getCurrentUser(): Promise<User | null> {
    return getSessionUser();
}

// --- GitHub API Helpers ---

async function getFileFromRepo(path: string): Promise<{ content: any, sha: string | undefined }> {
    const repoUrl = GITHUB_REPO_URL?.replace('https://github.com/', '');
    const apiUrl = `https://api.github.com/repos/${repoUrl}/contents/${path}`;

    try {
        const { data: fileData } = await axios.get(apiUrl, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });
        const content = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8'));
        return { content, sha: fileData.sha };
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return { content: [], sha: undefined };
        }
        console.error(`Error fetching ${path}:`, error);
        throw new Error(`Failed to fetch ${path} from repository.`);
    }
}

async function saveFileToRepo(path: string, data: any, commitMessage: string, sha?: string) {
    const repoUrl = GITHUB_REPO_URL?.replace('https://github.com/', '');
    const apiUrl = `https://api.github.com/repos/${repoUrl}/contents/${path}`;
    
    const updatedContent = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');

    const requestBody: { message: string; content: string; sha?: string } = {
        message: commitMessage,
        content: updatedContent,
    };

    if (sha) {
        requestBody.sha = sha;
    }

    await axios.put(apiUrl, requestBody, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
        },
    });
}


// --- User & Auth ---
export async function register(data: z.infer<typeof authSchema>) {
    const validated = authSchema.safeParse(data);
    if (!validated.success) return { error: "Invalid data." };

    const { username } = validated.data;

    const { content: users, sha } = await getFileFromRepo('users.json');

    const existingUser = (users as User[]).find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existingUser) {
        return { success: false, error: "Username already taken. Please choose another one." };
    }

    const newUser: User = {
        id: `user-mock-${Date.now()}`,
        username,
        name: username,
        avatarUrl: `https://i.pravatar.cc/150?u=${username}`,
    };

    const updatedUsers = [...users, newUser];
    await saveFileToRepo('users.json', updatedUsers, `New user registration: ${username}`, sha);
    
    await createSession(newUser);
    return { success: true, user: newUser };
}

export async function login(data: z.infer<typeof authSchema>) {
    const validated = authSchema.safeParse(data);
    if (!validated.success) return { error: "Invalid data." };

    const { username } = validated.data;

    const { content: users } = await getFileFromRepo('users.json');
    const user = (users as User[]).find(u => u.username.toLowerCase() === username.toLowerCase());

    if (!user) {
        return { success: false, error: "Invalid username or password." };
    }
    
    await createSession(user);
    return { success: true, user };
}

export async function logout() {
    await deleteSession();
    redirect('/home');
}

// --- Post & Interaction ---
export async function createPost(data: z.infer<typeof postSchema>): Promise<{ success: boolean; error?: string }> {
    const user = await getSessionUser();
    if (!user) {
        return { success: false, error: "Authentication required. Please log in." };
    }

    const validated = postSchema.safeParse(data);
    if (!validated.success) {
        return { success: false, error: "Invalid post data." };
    }

    const { content, category, imageUrl } = validated.data;

    const newPost: Post = {
        id: randomUUID(),
        author: user,
        content,
        category,
        imageUrl,
        likes: 0,
        comments: [],
        commentCount: 0,
        shares: 0,
        createdAt: new Date().toISOString(),
    };

    try {
        const { content: posts, sha } = await getFileFromRepo('posts.json');
        const updatedPosts = [newPost, ...posts];
        await saveFileToRepo('posts.json', updatedPosts, `New post by ${user.username}`, sha);
        
        revalidatePath('/');
        return { success: true };

    } catch (error) {
        console.error("Error creating post:", error);
        return { success: false, error: "Failed to create post." };
    }
}

// --- Data Fetching ---
export async function getPosts(): Promise<Post[]> {
    try {
        const { content: posts } = await getFileFromRepo('posts.json');
        return posts;
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

export async function getUsers(): Promise<User[]> {
    try {
        const { content: users } = await getFileFromRepo('users.json');
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export async function getUserByUsername(username: string): Promise<User | null> {
    const users = await getUsers();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
}
