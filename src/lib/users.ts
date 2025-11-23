
import 'server-only';
import { User } from "@/types";

// ==========================================================================
// MOCK DATABASE
// In a real application, these functions would interact with a database
// like PostgreSQL, MongoDB, or a service like Firebase.
// ==========================================================================

const mockUsers: User[] = [
    {
        id: '1',
        name: 'Alice',
        username: 'alice',
        email: 'alice@example.com',
        avatarUrl: 'https://i.pravatar.cc/150?u=alice',
        bannerUrl: '/default-banner.jpg',
        bio: 'Just a girl who loves to code and explore the world.',
        followers: 150,
        following: 75,
        hasPremium: true,
        profileTheme: 'dark',
        posts: [], // Populated dynamically
    },
    {
        id: '2',
        name: 'Bob',
        username: 'bob',
        email: 'bob@example.com',
        avatarUrl: 'https://i.pravatar.cc/150?u=bob',
        bannerUrl: '/default-banner.jpg',
        bio: 'Building cool stuff with Next.js and Tailwind CSS.',
        followers: 200,
        following: 100,
        hasPremium: false,
        profileTheme: 'default',
        posts: [],
    },
    {
        id: '3',
        name: 'Charlie',
        username: 'charlie',
        email: 'charlie@example.com',
        avatarUrl: 'https://i.pravatar.cc/150?u=charlie',
        bannerUrl: '/default-banner.jpg',
        bio: 'Design enthusiast and front-end developer.',
        followers: 120,
        following: 90,
        hasPremium: true,
        profileTheme: 'ocean',
        posts: [],
    },
];


// ==========================================================================
// MOCK API FUNCTIONS
// ==========================================================================

/**
 * Simulates fetching a user by their username from the database.
 * @param username The username to search for.
 * @returns A Promise that resolves to the User object or null if not found.
 */
export async function findUserByUsername(username: string): Promise<User | null> {
    console.log(`--- DB: Searching for user: ${username} ---`);
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate DB latency
    const user = mockUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (user) {
        console.log(`--- DB: Found user: ${user.username} ---`);
        return { ...user }; // Return a copy to prevent mutation
    }
    console.log(`--- DB: User not found: ${username} ---`);
    return null;
}

/**
 * Simulates fetching a limited number of users for suggestion.
 * @returns A Promise that resolves to an array of User objects.
 */
export async function getSuggestedUsers(limit: number = 3): Promise<User[]> {
    console.log(`--- DB: Fetching ${limit} suggested users ---`);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate DB latency
    // Return a shuffled and sliced array of users (excluding a hypothetical current user)
    const shuffled = [...mockUsers].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
}

/**
 * Simulates creating a new user in the database.
 * NOTE: This is a mock. It does not persist the user beyond the server's lifetime.
 * @param userData The data for the new user.
 * @returns A Promise that resolves to the newly created User object.
 */
export async function createUser(userData: Omit<User, 'id' | 'followers' | 'following' | 'posts'>): Promise<User> {
    console.log(`--- DB: Creating new user: ${userData.username} ---`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate DB latency
    const newUser: User = {
        id: `user-${Date.now()}`,
        ...userData,
        followers: 0,
        following: 0,
        posts: [],
    };
    mockUsers.push(newUser); // Add to our in-memory store
    console.log(`--- DB: Created user with ID: ${newUser.id} ---`);
    return newUser;
}
