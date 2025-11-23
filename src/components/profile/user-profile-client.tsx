
'use client';

import { User } from '@/types';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Calendar, Mail, UserPlus, UserCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from 'react';
import EditProfileDialog from './edit-profile-dialog';
import { format } from 'date-fns';

interface UserProfileClientProps {
  profileUser: User;
  // `createdAt` is mocked and won't be on the initial user object
  // In a real app, this should be part of the User type and fetched from the DB
  memberSince: Date;
}

export default function UserProfileClient({ profileUser, memberSince }: UserProfileClientProps) {
    const { user: currentUser } = useAuth();
    // Dummy state for follow functionality
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(profileUser.followers || 0);

    const isOwnProfile = currentUser?.id === profileUser.id;

    const handleFollow = () => {
        // This is a mocked action
        setIsFollowing(!isFollowing);
        setFollowerCount(prev => isFollowing ? prev - 1 : prev + 1);
    };

  return (
    <div className="bg-card/50 backdrop-blur-lg border border-border/20 rounded-xl shadow-lg p-6">
        {/* Banner */}
        <div 
            className="h-32 md:h-48 rounded-t-lg bg-cover bg-center -mx-6 -mt-6 mb-12" 
            style={{ backgroundImage: `url(${profileUser.bannerUrl || '/default-banner.jpg'})` }}
        />
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end -mt-24 space-y-4 md:space-y-0">
            <Avatar className="w-32 h-32 border-4 border-background ring-2 ring-primary">
                <AvatarImage src={profileUser.avatarUrl} alt={profileUser.name} />
                <AvatarFallback>{profileUser.name?.[0]}</AvatarFallback>
            </Avatar>
            
            <div className="md:ml-6 flex-grow">
                <h1 className="text-3xl font-bold text-center md:text-left">{profileUser.name}</h1>
                <p className="text-muted-foreground text-center md:text-left">@{profileUser.username}</p>
            </div>

            {isOwnProfile ? (
                <EditProfileDialog />
            ) : (
                <div className="flex items-center space-x-2">
                    <Button variant={isFollowing ? "secondary" : "default"} onClick={handleFollow}>
                        {isFollowing ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                        {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    <Button variant="outline"><Mail className="mr-2 h-4 w-4"/> Message</Button>
                </div>
            )}
        </div>

        {/* Bio and Stats */}
        <div className="mt-8">
            <p className="text-foreground/80 text-center md:text-left">{profileUser.bio || "No bio provided."}</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground mt-4">
                <div className="flex items-center">
                    <span className="font-semibold text-foreground mr-1">{followerCount}</span> Followers
                </div>
                <div className="flex items-center">
                    <span className="font-semibold text-foreground mr-1">{profileUser.following || 0}</span> Following
                </div>
                <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    Joined {format(memberSince, 'MMMM yyyy')}
                </div>
            </div>
        </div>
    </div>
  );
}

