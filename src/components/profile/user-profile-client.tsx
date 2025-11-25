
'use client';

import { User } from '@/types';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Calendar, Mail, UserPlus, UserCheck, Edit } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from 'react';
import EditProfileDialog from './edit-profile-dialog';
import { format } from 'date-fns';
import { LiquidGlass } from '../ui/liquid-glass';

interface UserProfileClientProps {
  profileUser: User;
  memberSince: Date;
}

export default function UserProfileClient({ profileUser, memberSince }: UserProfileClientProps) {
    const { user: currentUser } = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(profileUser.followers || 0);

    const isOwnProfile = currentUser?.id === profileUser.id;

    const handleFollow = () => {
        setIsFollowing(!isFollowing);
        setFollowerCount(prev => isFollowing ? prev - 1 : prev + 1);
    };

    // Glassmorphic button style
    const glassButtonStyle = "bg-white/10 border border-white/20 backdrop-blur-sm text-white hover:bg-white/20 shadow-lg";

  return (
    <LiquidGlass className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl text-white">
        <div 
            className="h-48 md:h-64 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${profileUser.bannerUrl || '/default-banner.jpg'})` }}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </div>
        
        <div className="p-6 md:p-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-24 md:-mt-32 space-y-4 md:space-y-0">
                <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-black/30 bg-background/80 ring-4 ring-primary/70 shadow-lg">
                    <AvatarImage src={profileUser.avatarUrl} alt={profileUser.name} />
                    <AvatarFallback>{profileUser.name?.[0]}</AvatarFallback>
                </Avatar>
                
                <div className="md:ml-6 flex-grow pt-16 md:pt-0">
                    <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left text-shadow-md">{profileUser.name}</h1>
                    <p className="text-lg text-white/70 text-center md:text-left">@{profileUser.username}</p>
                </div>

                <div className="pt-4 md:pt-0">
                    {isOwnProfile ? (
                        <EditProfileDialog triggerButton={
                            <Button className={glassButtonStyle}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Profile
                            </Button>
                        } />
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Button onClick={handleFollow} className={glassButtonStyle}>
                                {isFollowing ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                                {isFollowing ? 'Following' : 'Follow'}
                            </Button>
                            <Button className={glassButtonStyle}><Mail className="mr-2 h-4 w-4"/> Message</Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 text-center md:text-left">
                <p className="text-white/90 text-lg">{profileUser.bio || "This user prefers to keep an air of mystery."}</p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-md text-white/70 mt-6">
                    <div className="flex items-center">
                        <span className="font-semibold text-white mr-1.5">{followerCount}</span> Followers
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold text-white mr-1.5">{profileUser.following || 0}</span> Following
                    </div>
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1.5" />
                        Joined {format(memberSince, 'MMMM yyyy')}
                    </div>
                </div>
            </div>
        </div>
    </LiquidGlass>
  );
}
