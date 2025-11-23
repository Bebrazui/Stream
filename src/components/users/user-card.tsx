
import { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

interface UserCardProps {
    user: User;
}

export function UserCard({ user }: UserCardProps) {
    return (
        <div className="border rounded-lg p-4 flex items-center space-x-4">
            <Avatar>
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
                <Link href={`/profile/${user.username}`} className="font-semibold hover:underline">
                    {user.name}
                </Link>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
            <Button size="sm">Follow</Button>
        </div>
    );
}
