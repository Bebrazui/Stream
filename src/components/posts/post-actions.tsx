'use client';

import { useState, useTransition } from 'react';
import { MessageCircle, Heart, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updatePostLikes, updatePostShares } from '@/lib/actions';
import type { Post, User } from '@/types';

interface PostActionsProps {
  post: Post;
  currentUser: User | null;
}

export function PostActions({ post, currentUser }: PostActionsProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Optimistic UI state
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(() => 
    !!currentUser && !!post.likedBy && post.likedBy.includes(currentUser.id)
  );
  const [shares, setShares] = useState(post.shares);

  const handleLike = async () => {
    if (!currentUser) {
      toast({ variant: 'destructive', title: 'Please log in to like posts.' });
      return;
    }

    // Optimistic update
    const originalLikes = likes;
    const originalIsLiked = isLiked;
    
    setIsLiked(!isLiked);
    setLikes(likes + (!isLiked ? 1 : -1));

    startTransition(async () => {
      try {
        const result = await updatePostLikes(post.id);
        if (result.error) {
          throw new Error(result.error);
        }
        // Sync with server response
        setLikes(result.likes!);
        setIsLiked(result.likedBy!.includes(currentUser.id));
      } catch (error) {
        // Revert on error
        setLikes(originalLikes);
        setIsLiked(originalIsLiked);
        toast({ variant: 'destructive', title: 'Failed to update like.' });
      }
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.author.name}`,
        text: post.content,
        url: window.location.href,
      })
      .then(() => {
        startTransition(async () => {
            try {
                const result = await updatePostShares(post.id);
                if(result.success) {
                    setShares(result.shares!);
                }
            } catch (error) {
                // silently fail, share count is not critical
            }
        });
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
        // Fallback for desktop
        navigator.clipboard.writeText(window.location.href);
        toast({ title: 'Link copied to clipboard!' });
        startTransition(async () => {
             try {
                const result = await updatePostShares(post.id);
                if(result.success) {
                    setShares(result.shares!);
                }
            } catch (error) {
                // silently fail, share count is not critical
            }
        });
    }
  };

  return (
    <div className="flex items-center justify-start space-x-4 pt-2">
      <button 
        onClick={handleLike}
        disabled={isPending}
        className="flex items-center space-x-2 text-gray-500 hover:text-red-500 disabled:opacity-50"
      >
        <Heart className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
        <span className="font-semibold">{likes}</span>
      </button>
      <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
        <MessageCircle className="w-6 h-6" />
        <span className="font-semibold">{post.commentCount}</span>
      </button>
      <button 
        onClick={handleShare}
        disabled={isPending}
        className="flex items-center space-x-2 text-gray-500 hover:text-green-500 disabled:opacity-50"
       >
        <Share2 className="w-6 h-6" />
        <span className="font-semibold">{shares}</span>
      </button>
    </div>
  );
}
