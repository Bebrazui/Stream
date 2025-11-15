'use client';

import { useEffect, useState } from 'react';
import { getSuggestedUsers } from '@/lib/actions';
import { User } from '@/types';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';

// Classic skeleton loader for a light theme
function SuggestedUserSkeleton() {
    return (
        <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse"></div>
                <div className="h-3 w-1/2 rounded bg-gray-200 animate-pulse"></div>
            </div>
        </div>
    );
}

export function SuggestedUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user: currentUser } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            if (currentUser) {
                try {
                    setLoading(true);
                    const suggestedUsers = await getSuggestedUsers(currentUser.username);
                    setUsers(suggestedUsers);
                } catch (err) {
                    setError('Failed to fetch suggestions.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                setUsers([]);
                setLoading(false);
            }
        };
        fetchUsers();
    }, [currentUser]);

    if (!currentUser) return null; 

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => <SuggestedUserSkeleton key={i} />)}
            </div>
        );
    }

    if (error) {
        return <p className="text-sm text-red-500">{error}</p>;
    }

    if (users.length === 0) {
        return <p className="text-sm text-gray-500">No suggestions right now.</p>;
    }

    return (
        <div className="space-y-4">
            {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between gap-2">
                    <Link href={`/profile/${user.username}`} className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 group">
                           <Avatar className="h-10 w-10 border border-gray-300">
                                <AvatarImage src={user.avatarUrl ?? ''} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-gray-900 group-hover:underline truncate">{user.name}</p>
                                <p className="text-xs text-gray-600 truncate">@{user.username}</p>
                            </div>
                        </div>
                    </Link>
                    <Button 
                        size="sm" 
                        variant="outline"
                    >
                        Follow
                    </Button>
                </div>
            ))}
        </div>
    );
}
