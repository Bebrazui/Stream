'use client'
import type { Post } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useTransition } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Repeat, Share, Link as LinkIcon } from 'lucide-react';
import { PostComments } from './post-comments';
import { addComment, updatePostLikes, updatePostShares } from '@/lib/actions';

const currentUser = {
    id: 'user-4', 
    name: 'You',
    username: 'current_user',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-4',
    bio: 'This is the currently logged-in user.',
};

export function PostCard({ post }: { post: Post }) {
  const [isPending, startTransition] = useTransition();
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(post.likedBy?.includes(currentUser.id));
  const [shares, setShares] = useState(post.shares);
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  const handleLike = () => {
    const originalLikes = likes;
    const originalIsLiked = isLiked;

    // Optimistic update
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);

    startTransition(async () => {
        try {
            const result = await updatePostLikes(post.id, currentUser.id);
            if (!result.success) {
                // Revert if server update fails
                setLikes(originalLikes);
                setIsLiked(originalIsLiked);
            } else {
                // Optional: Sync with server state if needed, though often not necessary
                // setLikes(result.likes!);
                // setIsLiked(result.likedBy!.includes(currentUser.id));
            }
        } catch (error) {
            console.error('Failed to update like:', error);
            // Revert on any error
            setLikes(originalLikes);
            setIsLiked(originalIsLiked);
        }
    });
  };

  const handleShare = () => {
    startTransition(async () => {
        const result = await updatePostShares(post.id);
        if (result.success) {
            setShares(result.shares!);
        }
    });
  };

  const handleCopyLink = () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl);
    // Optionally, show a toast or confirmation message.
  };

  return (
    <Card className="w-full max-w-2xl transition-shadow duration-300 ease-in-out hover:shadow-lg">
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <Link href={`/profile/${post.author.username}`}>
          <Avatar>
            <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col">
          <Link href={`/profile/${post.author.username}`} className="font-bold hover:underline">
            {post.author.name}
          </Link>
          <p className="text-sm text-muted-foreground">
            @{post.author.username} · {timeAgo}
          </p>
        </div>
      </CardHeader>

      <div>
        <CardContent className="px-4 pt-0">
          <p className="whitespace-pre-wrap">{post.content}</p>
          {post.imageUrl && (
            <div className="relative mt-4 overflow-hidden rounded-lg border">
              <Image
                src={post.imageUrl}
                alt="Post image"
                width={600}
                height={400}
                className="aspect-[3/2] w-full object-cover"
                data-ai-hint="post image"
              />
            </div>
          )}
          {post.linkUrl && (
            <a
              href={post.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-3 rounded-lg border p-3 hover:bg-secondary"
            >
              <LinkIcon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{post.linkUrl}</p>
              </div>
            </a>
          )}
        </CardContent>

        <CardFooter className="flex-col items-start px-4 pb-4 pt-2">
          <div className="flex w-full justify-between text-muted-foreground">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span>{post.commentCount}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={handleShare}>
              <Repeat className="h-5 w-5" />
              <span>{shares}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={handleLike} disabled={isPending}>
              <Heart className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
              <span>{likes}</span>
            </Button>
            <div className="relative">
                <Button variant="ghost" size="sm" onClick={handleCopyLink}>
                    <Share className="h-5 w-5" />
                </Button>
            </div>
          </div>

          <div className="mt-4 w-full">
            <PostComments post={post} addComment={addComment} currentUser={currentUser} />
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
