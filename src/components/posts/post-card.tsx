'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Post, User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import PostActions from './post-actions';
import { PostImage } from './post-image';
import CommentList from './comment-list';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/context/auth-context';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const { user: currentUser } = useAuth();
    const [showComments, setShowComments] = useState(false);

    const cardVariants: Variants = {
        hidden: {
            opacity: 0,
            filter: "blur(4px)",
            y: 50
        },
        visible: {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

  const userHasLiked = post.likedBy?.includes(currentUser?.id || '') || false;

  return (
    <motion.div
      className="bg-card/50 backdrop-blur-lg border border-border/20 rounded-xl shadow-sm overflow-hidden p-5"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
        {/* Card Header */}
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
                <Link href={`/profile/${post.author.username}`}>
                    <Avatar className="h-11 w-11">
                        <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                        <AvatarFallback>{post.author.name?.[0]}</AvatarFallback>
                    </Avatar>
                </Link>
                <div>
                    <div className="flex items-center gap-2">
                        <Link href={`/profile/${post.author.username}`} className="font-bold hover:underline">{post.author.name}</Link>
                        <span className="text-sm text-muted-foreground">@{post.author.username}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </p>
                </div>
            </div>
            {post.category && <Badge variant="secondary">{post.category}</Badge>}
        </div>

        {/* Post Content */}
        <p className="text-foreground/90 whitespace-pre-wrap mb-4">{post.content}</p>

        {/* Image if it exists */}
        {post.imageUrl && <PostImage src={post.imageUrl} alt={`Image for post by ${post.author.name}`} />}

        {/* Actions */}
        <PostActions 
            postId={post.id}
            initialLikes={post.likes}
            initialShares={post.shares}
            commentCount={post.commentCount}
            userLiked={userHasLiked}
        />

        {/* Toggle Comments Button */}
        {post.commentCount > 0 && (
            <button 
                onClick={() => setShowComments(!showComments)} 
                className="text-sm text-muted-foreground mt-3 hover:underline"
            >
                {showComments ? 'Hide comments' : `View all ${post.commentCount} comments`}
            </button>
        )}

        {/* Comments Section */}
        {showComments && (
            <div className="mt-4">
                <CommentList comments={post.comments || []} isLoading={false} />
            </div>
        )}

    </motion.div>
  );
};

export default PostCard;