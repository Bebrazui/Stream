'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Post } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import PostActions from './post-actions';
import { PostImage } from './post-image';
import CommentList from './comment-list';
import { useAuth } from '@/context/auth-context';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { TimeAgo } from '@/components/ui/time-ago';

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

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const { user: currentUser } = useAuth();
    const [showComments, setShowComments] = useState(false);

    const userHasLiked = post.likedBy?.includes(currentUser?.id || '') || false;

    const motionProps = useMemo(() => ({
        variants: cardVariants,
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.2 },
        whileHover: { scale: 1.02, transition: { duration: 0.2 } }
    }), []);

  return (
    <LiquidGlass
      className="p-5 rounded-xl"
      motionProps={motionProps}
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
                    <TimeAgo date={post.createdAt} className="text-xs text-muted-foreground" />
                </div>
            </div>
            {post.category && <Badge variant="secondary">{post.category}</Badge>}
        </div>

        {/* Post Content */}
        <p className="text-slate-100/90 whitespace-pre-wrap mb-4">{post.content}</p>

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

    </LiquidGlass>
  );
};

export default PostCard;
