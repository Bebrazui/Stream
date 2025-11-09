'use client';

import { useState } from 'react';
import type { User, Post } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/posts/post-card';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

type UserProfileClientProps = {
  user: User;
  posts: Post[];
  isCurrentUserProfile: boolean;
};

export function UserProfileClient({ user, posts, isCurrentUserProfile }: UserProfileClientProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false); // Placeholder state
  
  // A more realistic follower count would come from props if available
  const [followerCount, setFollowerCount] = useState(user.followers || 0);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    setFollowerCount(isFollowing ? followerCount - 1 : followerCount + 1);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="overflow-hidden">
        <div className="h-32 bg-secondary sm:h-48" />
        <CardContent className="p-4 sm:p-6">
          <div className="relative flex flex-col sm:flex-row sm:items-end sm:gap-6">
            <div className="-mt-16 sm:-mt-24">
              <div className="relative h-24 w-24 rounded-full border-4 border-card sm:h-32 sm:w-32">
                <Image
                  src={user.avatarUrl || 'https://picsum.photos/seed/placeholder/200/200'} // Fallback avatar
                  alt={user.name}
                  fill
                  className="rounded-full object-cover"
                  data-ai-hint="person portrait"
                />
              </div>
            </div>
            <div className="mt-2 flex flex-1 flex-col gap-1 sm:mt-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-headline text-2xl font-bold">{user.name}</h1>
                        <p className="text-muted-foreground">@{user.username}</p>
                    </div>
                    <div>
                        {isCurrentUserProfile ? (
                            <Button variant="outline" onClick={() => router.push('/profile/currentuser/edit')}>Edit Profile</Button>
                        ) : (
                            <Button onClick={handleFollowToggle}>
                            {isFollowing ? 'Following' : 'Follow'}
                            </Button>
                        )}
                    </div>
                </div>
                 {/* Display Bio if it exists */}
                 {user.bio && <p className="mt-2 text-sm text-muted-foreground">{user.bio}</p>}
                 <div className="mt-2 flex items-center gap-4 text-sm">
                    <p><span className="font-bold">{user.following || 0}</span> Following</p>
                    <p><span className="font-bold">{followerCount}</span> Followers</p>
                 </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <h2 className="mb-6 font-headline text-xl font-bold">Posts</h2>
        {posts.length > 0 ? (
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <p>@{user.username} hasn't posted anything yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
