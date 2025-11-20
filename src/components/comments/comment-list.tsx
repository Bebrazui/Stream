'use client';

import type { Comment } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
}

export function CommentList({ comments, isLoading }: CommentListProps) {

  if (isLoading) {
    return (
      <div className="space-y-4 mt-4">
        <div className="flex items-start space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
        <div className="flex items-start space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6 mt-6">
       {comments.map((comment) => (
         <div key={comment.id} className="flex items-start space-x-4">
            <Avatar>
              <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
              <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-baseline space-x-2">
                <span className="font-bold text-white">{comment.author.name}</span>
                <span className="text-sm text-white/60">@{comment.author.username} Â· {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
              </div>
              <p className="mt-1 text-white/80">{comment.text}</p>
            </div>
         </div>
       ))}
    </div>
  );
}
