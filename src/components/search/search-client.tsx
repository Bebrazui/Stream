
'use client';

import { useState, useTransition } from 'react';
import { Input } from "@/components/ui/input";
import { User, Post } from '@/types';
import { UserCard } from '../users/user-card'; 
import PostCard from '../posts/post-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon, Loader2 } from 'lucide-react';

interface SearchClientProps {
    initialUsers?: User[];
    initialPosts?: Post[];
}

// MOCK SEARCH FUNCTION
async function mockSearch(query: string, type: 'users' | 'posts') {
    console.log(`Mock searching for ${type} with query: "${query}"`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    if (type === 'users') {
        return [
            // Dummy user data
            { id: '1', name: 'Alice', username: 'alice', avatarUrl: 'https://i.pravatar.cc/150?u=alice' },
            { id: '2', name: 'Bob', username: 'bob', avatarUrl: 'https://i.pravatar.cc/150?u=bob' },
        ] as User[];
    }
    if (type === 'posts') {
        return [
            // Dummy post data
            { id: 'p1', content: `Searching for ${query}`, author: { id: '1', name: 'Alice', username: 'alice', avatarUrl: '' }, createdAt: new Date().toISOString(), likes: 0, comments: [], commentCount: 0, shares: 0 },
        ] as Post[];
    }
    return [];
}

export default function SearchClient({ initialUsers = [], initialPosts = [] }: SearchClientProps) {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [isSearching, startSearch] = useTransition();

    const handleSearch = (value: string) => {
        setQuery(value);
        if (value.length > 1) {
            startSearch(async () => {
                const [userResults, postResults] = await Promise.all([
                    mockSearch(value, 'users'),
                    mockSearch(value, 'posts'),
                ]);
                setUsers(userResults);
                setPosts(postResults);
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search for users or posts..."
                    className="pl-10 w-full"
                    onChange={(e) => handleSearch(e.target.value)}
                    value={query}
                />
                {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin" />}
            </div>

            <Tabs defaultValue="users" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                </TabsList>
                <TabsContent value="users">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {users.map(user => (
                            <UserCard key={user.id} user={user} />
                        ))}
                    </div>
                    {!isSearching && users.length === 0 && query && (
                        <p className="text-center text-muted-foreground mt-8">No users found for "{query}".</p>
                    )}
                </TabsContent>
                <TabsContent value="posts">
                    <div className="space-y-4 mt-4">
                        {posts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                     {!isSearching && posts.length === 0 && query && (
                        <p className="text-center text-muted-foreground mt-8">No posts found for "{query}".</p>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

