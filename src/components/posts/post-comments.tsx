'use client';
import { useState } from 'react';
import type { Comment, Post, User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface PostCommentsProps {
  post: Post;
  addComment: (postId: string, text: string) => Promise<void>;
  currentUser: User | null; // Can be null if the user is not logged in
}

export function PostComments({ post, addComment, currentUser }: PostCommentsProps) {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = async () => {
    if (newComment.trim() && currentUser) {
      await addComment(post.id, newComment);
      setNewComment('');
    }
  };

  const comments = Array.isArray(post.comments) ? post.comments : [];

  return (
    <div className="space-y-4">
      {/* Comments List */}
      <div className="space-y-2">
        {comments.slice(0, 3).map((comment) => (
          <div key={comment.id} className="flex items-start space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
              <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <span className="font-semibold">{comment.author.username}</span>{' '}
              <span>{comment.text}</span>
            </div>
          </div>
        ))}
      </div>

      {post.commentCount > 3 && (
        <Button variant="link" asChild>
          <Link href={`/posts/${post.id}/comments`}>View all {post.commentCount} comments</Link>
        </Button>
      )}

      {/* Add Comment Form - only shown if a user is logged in */}
      {currentUser && (
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
          </Avatar>
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1"
          />
          <Button onClick={handleAddComment} disabled={!newComment.trim()}>
            Post
          </Button>
        </div>
      )}
    </div>
  );
}
