
'use client';

import { useState, useTransition } from 'react';
import { MessageCircle, Repeat, Heart, Share } from 'lucide-react';
import { updatePostLikes, updatePostShares } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/components/ui/use-toast';

interface PostActionsProps {
  postId: string;
  initialLikes: number;
  initialShares: number;
  commentCount: number;
  userLiked: boolean;
}

export default function PostActions({ 
    postId, 
    initialLikes, 
    initialShares, 
    commentCount,
    userLiked
}: PostActionsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [likes, setLikes] = useState(initialLikes);
  const [shares, setShares] = useState(initialShares);
  const [liked, setLiked] = useState(userLiked);

  const handleLike = async () => {
    if (!user) {
        toast({ title: "Authentication Error", description: "You must be logged in to like a post.", variant: "destructive" });
        return;
    }
    const newLikedState = !liked;
    const newLikesCount = newLikedState ? likes + 1 : likes - 1;
    setLiked(newLikedState);
    setLikes(newLikesCount);

    startTransition(async () => {
      const result = await updatePostLikes(postId);
      if (result.error) {
        // Revert optimistic update on error
        setLiked(!newLikedState);
        setLikes(likes);
        toast({ title: "Error", description: result.error, variant: "destructive" });
      } else {
        // Optionally update with the actual count from the server
        setLikes(result.likes || newLikesCount);
      }
    });
  };

  const handleShare = () => {
    const newSharesCount = shares + 1;
    setShares(newSharesCount);

    startTransition(async () => {
        const result = await updatePostShares(postId);
        if (result.error) {
            setShares(shares); // Revert on error
            toast({ title: "Error", description: result.error, variant: "destructive" });
        } else {
            setShares(result.shares || newSharesCount);
        }
    });
  };

  const iconSize = 18;
  const buttonClasses = "flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200";

  return (
    <div className="flex justify-between items-center mt-4 pt-2 border-t">
      <button className={buttonClasses}>
        <MessageCircle size={iconSize} />
        <span>{commentCount}</span>
      </button>
      <button className={buttonClasses} onClick={handleShare}>
        <Repeat size={iconSize} />
        <span>{shares}</span>
      </button>
      <button 
        className={cn(buttonClasses, { 'text-red-500': liked, 'hover:text-red-500': true })} 
        onClick={handleLike}
      >
        <Heart size={iconSize} className={cn({ 'fill-current': liked })} />
        <span>{likes}</span>
      </button>
      <button className={buttonClasses}>
        <Share size={iconSize} />
      </button>
    </div>
  );
}

