'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Post, User, Comment, Community } from '@/types'; // Removed UserCredentials
import { createSession, getSessionUser, deleteSession } from '@/lib/session';

// --- Zod Schemas ---
const postSchema = z.object({
  content: z.string().min(1).max(280),
  category: z.enum(['programming', 'nature', 'games', 'other']),
  imageUrl: z.string().optional(),
});

const communitySchema = z.object({
    name: z.string().min(3).max(21),
    description: z.string().max(500).optional(),
});

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  bio: z.string().max(160, 'Bio must not be longer than 160 characters.').optional(),
  avatarUrl: z.string().url('Please enter a valid URL.').optional(),
});

const authSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    captchaAnswer: z.string().optional(),
    captchaToken: z.string().optional(),
});

// --- MOCKED SERVER ACTIONS ---

// --- CAPTCHA ---
export async function generateCaptcha() {
    console.log("--- MOCKED: generateCaptcha() ---");
    return {
        captchaQuestion: "What is 1 + 1?",
        captchaToken: "mock-token",
    };
}

// --- User & Auth ---
export async function register(data: z.infer<typeof authSchema>) {
    console.log("--- MOCKED: register() ---");
    const validated = authSchema.safeParse(data);
    if (!validated.success) return { error: "Invalid data." };

    const { username } = validated.data;
    const mockUser: User = {
        id: `user-mock-${Date.now()}`,
        username,
        name: username,
        avatarUrl: `https://i.pravatar.cc/150?u=${username}`,
    };
    await createSession(mockUser);
    return { success: true, user: mockUser };
}

export async function login(data: z.infer<typeof authSchema>) {
    console.log("--- MOCKED: login() ---");
    const validated = authSchema.safeParse(data);
    if (!validated.success) return { error: "Invalid data." };

    const { username } = validated.data;
    const mockUser: User = {
        id: `user-mock-${Date.now()}`,
        username,
        name: username,
        avatarUrl: `https://i.pravatar.cc/150?u=${username}`,
    };
    await createSession(mockUser);
    return { success: true, user: mockUser };
}

export async function logout() {
    console.log("--- LOGIC KEPT: logout() ---");
    await deleteSession();
    redirect('/');
}

// --- Community ---
export async function createCommunity(values: z.infer<typeof communitySchema>, creator: User) {
    console.log("--- MOCKED: createCommunity() ---");
    const validated = communitySchema.safeParse(values);
    if (!validated.success) return { error: "Invalid community data." };

    const { name, description } = validated.data;

    const newCommunity: Community = {
        id: `comm-mock-${Date.now()}`,
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description: description || 'A new community!',
        creator,
        members: 1,
        createdAt: new Date().toISOString(),
    };

    revalidatePath('/');
    return { success: true, community: newCommunity };
}

// --- Post & Interaction ---
export async function createPost(data: z.infer<typeof postSchema>): Promise<{ success: boolean; error?: string }> {
    console.log("--- MOCKED: createPost() ---");
    const user = await getSessionUser();
    if (!user) return { success: false, error: "Mock Auth: Please log in." };
    await new Promise(resolve => setTimeout(resolve, 500));
    revalidatePath('/');
    return { success: true };
}

export async function addComment(postId: string, text: string) {
    console.log("--- MOCKED: addComment() ---");
    const user = await getSessionUser();
    if (!user) return { error: "Mock Auth: Please log in." };
    await new Promise(resolve => setTimeout(resolve, 300));
    revalidatePath('/');
    return { success: true };
}

export async function updatePostLikes(postId: string) {
    console.log("--- MOCKED: updatePostLikes() ---");
    const user = await getSessionUser();
    if (!user) return { error: "Mock Auth: Please log in." };
    return { success: true, likes: Math.floor(Math.random() * 100), likedBy: [] };
}

export async function updatePostShares(postId: string) {
    console.log("--- MOCKED: updatePostShares() ---");
    return { success: true, shares: Math.floor(Math.random() * 50) };
}

// --- Profile ---
export async function updateProfile(formData: FormData) {
    console.log("--- MOCKED: updateProfile() ---");
    const user = await getSessionUser();
    if (!user) return { error: 'Mock Auth: Please log in.' };
    return { success: true, user };
}

// --- Data Fetching ---
export async function getPosts(): Promise<Post[]> {
    console.log("--- MOCKED: getPosts() ---");
    const mockPosts: Post[] = []; // Empty array for now
    return mockPosts;
}

export async function getUsers(): Promise<User[]> {
    console.log("--- MOCKED: getUsers() ---");
    return [];
}

export async function getSuggestedUsers(): Promise<User[]> {
    console.log("--- MOCKED: getSuggestedUsers() ---");
    return [];
}

export async function getUserByUsername(username: string): Promise<User | null> {
    console.log("--- MOCKED: getUserByUsername() ---");
    if (username) {
        return {
            id: `user-mock-profile-${Date.now()}`,
            username: username,
            name: username.charAt(0).toUpperCase() + username.slice(1),
            avatarUrl: `https://i.pravatar.cc/150?u=${username}`,
            bio: `This is a mocked profile for ${username}.`,
        };
    }
    return null;
}
