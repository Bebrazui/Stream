'use client';
import { useState } from 'react';
import type { Comment, Post, User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface PostCommentsProps {
  post: Post;
  onCommentSubmit: (commentText: string) => Promise<{ success: boolean } | null>;
  currentUser: User | null; 
}

export function PostComments({ post, onCommentSubmit, currentUser }: PostCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async () => {
    if (newComment.trim() && currentUser) {
      setIsSubmitting(true);
      const result = await onCommentSubmit(newComment);
      if (result?.success) {
        setNewComment('');
      }
      setIsSubmitting(false);
    }
  };

  const comments = Array.isArray(post.comments) ? post.comments : [];

  return (
    <div className="w-full space-y-4 text-sm">
      
      {comments.length > 0 && (
        <div className="space-y-3 pt-2">
          {comments.slice(0, 3).map((comment) => (
            <div key={comment.id} className="flex items-start space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
                <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
              </Avatar>
              <p className="flex-1 break-words">
                <Link href={`/profile/${comment.author.username}`} className="font-semibold pr-2 hover:underline">
                  {comment.author.username}
                </Link>
                {comment.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {post.commentCount > 3 && (
        <Button variant="link" asChild className="p-0 h-auto font-normal text-gray-500">
          <Link href={`/posts/${post.id}`}>View all {post.commentCount} comments</Link>
        </Button>
      )}

      {currentUser && (
        <div className="flex items-center space-x-2 pt-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 h-8"
            onKeyDown={(e) => e.key === 'Enter' && !isSubmitting && handleAddComment()}
          />
          <Button onClick={handleAddComment} disabled={!newComment.trim() || isSubmitting} size="sm">
            Post
          </Button>
        </div>
      )}
    </div>
  );
}
