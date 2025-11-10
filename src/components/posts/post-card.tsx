'use client'

import type { Post, User } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import * as React from 'react'; // Use namespace import for React
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Repeat, Share, Link as LinkIcon } from 'lucide-react';
import { PostComments } from './post-comments';
import { addComment, updatePostLikes, updatePostShares } from '@/lib/actions';
import { useToast } from '@/components/ui/use-toast';

interface PostCardProps {
    post: Post;
    currentUser: User | null; // Can be null if the user is not logged in
}

export function PostCard({ post, currentUser }: PostCardProps) {
  const [isPending, startTransition] = React.useTransition();
  const [likes, setLikes] = React.useState(post.likes);
  const [isLiked, setIsLiked] = React.useState(currentUser ? post.likedBy?.includes(currentUser.id) : false);
  const [shares, setShares] = React.useState(post.shares);
  const { toast } = useToast();
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  const handleLike = () => {
    if (!currentUser) {
        toast({ variant: 'destructive', title: 'Please log in to like posts.' });
        return;
    }

    const originalLikes = likes;
    const originalIsLiked = isLiked;

    // Optimistic update
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);

    startTransition(async () => {
        try {
            const result = await updatePostLikes(post.id);
            if (!result.success) {
                setLikes(originalLikes);
                setIsLiked(originalIsLiked);
                toast({ variant: 'destructive', title: 'Failed to update like.' });
            }
        } catch (error) {
            console.error('Failed to update like:', error);
            setLikes(originalLikes);
            setIsLiked(originalIsLiked);
            toast({ variant: 'destructive', title: 'An error occurred.' });
        }
    });
  };

  const handleShare = () => {
    if (!currentUser) {
      toast({ variant: 'destructive', title: 'Please log in to share posts.' });
      return;
    }

    const originalShares = shares;
    setShares(shares + 1); // Optimistic update

    startTransition(async () => {
        try {
            const result = await updatePostShares(post.id);
            if (!result.success) {
                setShares(originalShares);
                toast({ variant: 'destructive', title: 'Failed to update share count.' });
            }
        } catch (error) {
            console.error('Failed to update share count:', error);
            setShares(originalShares);
            toast({ variant: 'destructive', title: 'An error occurred while sharing.' });
        }
    });
  };


  const handleCommentSubmit = async (commentText: string) => {
    if (!currentUser) {
        toast({ variant: 'destructive', title: 'Please log in to comment.' });
        return null;
    }
    // Server action will get user from session, no need to pass it
    const result = await addComment(post.id, commentText);
    if (result.error) {
        toast({ variant: 'destructive', title: 'Failed to add comment', description: result.error });
        return null;
    }
    toast({ title: 'Comment posted!' });
    // In a real app, you'd likely get the new comment object back and update the state
    // For now, we just revalidate the path on the server.
    return { success: true }; 
  };
  
  return (
    <Card className="w-full max-w-xl mx-auto border-0 sm:border rounded-none sm:rounded-lg shadow-none sm:shadow-md">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Link href={`/profile/${post.author.username}`}>
            <Avatar>
              <AvatarImage src={post.author.avatarUrl} alt={`${post.author.name}'s avatar`} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
        </Link>
        <div className="flex flex-col">
            <Link href={`/profile/${post.author.username}`} className="font-bold hover:underline">
                {post.author.name}
            </Link>
            <span className="text-sm text-gray-500">@{post.author.username} Â· {timeAgo}</span>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <p className="whitespace-pre-wrap">{post.content}</p>
        {post.imageUrl && (
            <div className="mt-4 rounded-lg overflow-hidden border">
                <Image src={post.imageUrl} alt="Post image" width={500} height={500} className="object-cover w-full h-full" />
            </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center p-2 border-t">
        <PostComments post={post} currentUser={currentUser} onCommentSubmit={handleCommentSubmit} />
        
        <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handleLike} className={`${isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}>
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <span className="text-sm min-w-[1rem]">{likes > 0 && likes}</span>
        </div>

        <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-500">
                <Repeat className="h-5 w-5" />
            </Button>
            <span className="text-sm min-w-[1rem]">{shares > 0 && shares}</span>
        </div>

        <Button variant="ghost" size="icon" onClick={handleShare} className="text-gray-500 hover:text-green-500">
          <Share className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-indigo-500">
            <LinkIcon className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
