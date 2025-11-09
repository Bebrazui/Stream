'use client';

import { useEffect, useState } from 'react';
import { getSuggestedUsers } from '@/lib/actions';
import { User } from '@/types';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';

function SuggestedUserSkeleton() {
    return (
        <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
            <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-muted animate-pulse"></div>
                <div className="h-3 w-1/2 rounded bg-muted animate-pulse"></div>
            </div>
        </div>
    );
}

export function SuggestedUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user: currentUser } = useAuth(); // Get the current user from context

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const suggestedUsers = await getSuggestedUsers(currentUser?.username);
                setUsers(suggestedUsers);
            } catch (err) {
                setError('Failed to fetch suggestions. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentUser]); // Re-fetch when the current user changes

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => <SuggestedUserSkeleton key={i} />)}
            </div>
        );
    }

    if (error) {
        return <p className="text-sm text-destructive">{error}</p>;
    }

    if (users.length === 0) {
        return <p className="text-sm text-muted-foreground">No user suggestions at the moment.</p>;
    }

    return (
        <div className="space-y-4">
            {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                    <Link href={`/profile/${user.username}`}>
                        <div className="flex items-center space-x-3">
                           <Avatar>
                                <AvatarImage src={user.avatarUrl} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-semibold text-sm hover:underline">{user.name}</span>
                                <span className="text-xs text-muted-foreground">@{user.username}</span>
                            </div>
                        </div>
                    </Link>
                    <Button size="sm" variant="outline">Follow</Button>
                </div>
            ))}
        </div>
    );
}
