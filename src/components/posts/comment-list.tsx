
'use client';

// This is a placeholder component to resolve the import error.
// It currently does not render anything.

import React from 'react';
import { Comment } from '@/types';

export interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
}

const CommentList: React.FC<CommentListProps> = ({ comments, isLoading }) => {
  if (isLoading) {
    return <div>Loading comments...</div>;
  }

  if (comments.length === 0) {
    return <div>No comments yet.</div>;
  }

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id}>{comment.text}</div>
      ))}
    </div>
  );
};

export default CommentList;
