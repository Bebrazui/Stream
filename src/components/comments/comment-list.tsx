
'use client';

import type { Comment } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return null; // Don't render anything if there are no comments
  }

  return (
    <div className="pt-4 border-t border-white/20">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start gap-4 p-4">
           <Link href={`/profile/${comment.author.username}`}>
             <Avatar className="w-10 h-10 border-2 border-white/30">
                <AvatarImage src={comment.author.avatarUrl} alt={`${comment.author.name}\'s avatar`} />
                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
             </Avatar>
           </Link>
           <div className="flex-1">
             <div className="flex items-baseline gap-2">
               <Link href={`/profile/${comment.author.username}`} className="font-bold text-white/90 hover:underline">
                 {comment.author.name}
               </Link>
               <span className="text-sm text-white/60">@{comment.author.username} Â· {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
             </div>
             <p className="mt-1 text-white/80">{comment.content}</p>
           </div>
        </div>
      ))}
    </div>
  );
}
