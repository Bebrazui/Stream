'use client';

import type { Post, User } from '@/types';
import { PostCard } from './post-card';
import { Skeleton } from '../ui/skeleton';

interface PostListProps {
  posts: Post[];
  currentUser: User | null;
  isLoading: boolean;
}

export function PostList({ posts, currentUser, isLoading }: PostListProps) {

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        <h2 className="text-2xl font-bold">No posts yet</h2>
        <p>Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUser={currentUser} />
      ))}
    </div>
  );
}
