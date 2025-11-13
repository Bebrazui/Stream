'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Post, User, Comment, UserCredentials } from '@/types';
import { createSession, getSessionUser, deleteSession } from '@/lib/session';

// --- Zod Schemas (kept for form validation) ---
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
    captchaAnswer: z.string().optional(), // Made optional to bypass
    captchaToken: z.string().optional(), // Made optional to bypass
});

// --- MOCKED SERVER ACTIONS ---

// --- CAPTCHA Generation (Mocked) ---
export async function generateCaptcha() {
    console.log("--- MOCKED: generateCaptcha() ---");
    return {
        captchaQuestion: "What is 1 + 1?",
        captchaToken: "mock-token",
    };
}

// --- User & Auth Actions (Mocked) ---
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
        bio: 'This is a mocked user profile.',
        followers: 0,
        following: 0,
        profileTheme: 'default',
        avatarFrame: 'none'
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
        bio: 'This is a mocked user profile.',
        followers: 0,
        following: 0,
        profileTheme: 'default',
        avatarFrame: 'none'
    };
    await createSession(mockUser);
    return { success: true, user: mockUser };
}

export async function logout() {
    console.log("--- LOGIC KEPT: logout() ---");
    await deleteSession();
    redirect('/');
}

// --- Post & Interaction Actions (Mocked) ---
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

// --- Profile Actions (Mocked) ---
export async function updateProfile(formData: FormData) {
    console.log("--- MOCKED: updateProfile() ---");
    const user = await getSessionUser();
    if (!user) return { error: 'Mock Auth: Please log in.' };
    return { success: true, user };
}

// --- Data Fetching Actions (Mocked) ---
export async function getPosts(): Promise<Post[]> {
    console.log("--- MOCKED: getPosts() ---");
    const mockPosts: Post[] = [
        {
            id: 'post-mock-1',
            content: 'Just finished setting up my new development environment with Next.js and TypeScript. It feels so fast and productive! #webdev #coding',
            author: { id: 'user-mock-1', name: 'Alice', username: 'alice', avatarUrl: 'https://i.pravatar.cc/150?u=alice' },
            createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
            likes: 15,
            likedBy: [],
            comments: [
                { id: 'comment-mock-1', text: 'Nice! What other tools are you using?', author: { id: 'user-mock-2', name: 'Bob', username: 'bob', avatarUrl: 'https://i.pravatar.cc/150?u=bob' }, createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
                { id: 'comment-mock-2', text: 'Welcome to the dark side! 😉', author: { id: 'user-mock-3', name: 'Charlie', username: 'charlie', avatarUrl: 'https://i.pravatar.cc/150?u=charlie' }, createdAt: new Date(Date.now() - 1000 * 60 * 1).toISOString() }
            ],
            commentCount: 2,
            shares: 3,
            category: 'programming'
        },
        {
            id: 'post-mock-2',
            content: 'Took a hike this morning and captured this beautiful sunrise. Nature is the best artist. 🌲☀️',
            imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop',
            author: { id: 'user-mock-2', name: 'Bob', username: 'bob', avatarUrl: 'https://i.pravatar.cc/150?u=bob' },
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            likes: 42,
            likedBy: [],
            comments: [],
            commentCount: 0,
            shares: 8,
            category: 'nature'
        },
        {
            id: 'post-mock-3',
            content: "Just spent the weekend playing Elden Ring. The world design is absolutely breathtaking. What's your favorite game of all time?",
            author: { id: 'user-mock-3', name: 'Charlie', username: 'charlie', avatarUrl: 'https://i.pravatar.cc/150?u=charlie' },
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            likes: 88,
            likedBy: [],
            comments: [],
            commentCount: 0,
            shares: 12,
            category: 'games'
        },
        {
            id: 'post-mock-4',
            content: 'Thinking about learning Rust. Has anyone made the switch from languages like Python or JavaScript? Would love to hear your experiences!',
            author: { id: 'user-mock-1', name: 'Alice', username: 'alice', avatarUrl: 'https://i.pravatar.cc/150?u=alice' },
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
            likes: 5,
            likedBy: [],
            comments: [],
            commentCount: 0,
            shares: 1,
            category: 'programming'
        }
    ];
    return mockPosts;
}

export async function getUsers(): Promise<User[]> {
    console.log("--- MOCKED: getUsers() ---");
    return []; // Return empty array
}

export async function getSuggestedUsers(): Promise<User[]> {
    console.log("--- MOCKED: getSuggestedUsers() ---");
    return []; // Return empty array
}

export async function getUserByUsername(username: string): Promise<User | null> {
    console.log("--- MOCKED: getUserByUsername() ---");
    // Return a mock user to make profile pages viewable
    if (username) {
        return {
            id: `user-mock-profile-${Date.now()}`,
            username: username,
            name: username.charAt(0).toUpperCase() + username.slice(1),
            avatarUrl: `https://i.pravatar.cc/150?u=${username}`,
            bio: `This is a mocked profile for ${username}. The real data is not being fetched.`,
            followers: 0,
            following: 0,
            profileTheme: 'default',
            avatarFrame: 'none',
            posts: []
        };
    }
    return null;
}
