'use client';

import type { Post, Comment, User } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import * as React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Repeat, Share } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CommentForm } from '@/components/comments/comment-form';
import { CommentList } from '@/components/comments/comment-list';

const ActionButton = ({ children, onClick, active }: { children: React.ReactNode, onClick?: () => void, active?: boolean }) => (
  <Button 
    variant="ghost" 
    size="icon" 
    onClick={onClick}
    className={`rounded-full text-white/70 hover:bg-white/20 hover:text-white transition-colors ${active ? 'text-neon-soft-pink' : ''}`}>
    {children}
  </Button>
);

export function PostCard({ post, currentUser }: { post: Post; currentUser: User | null }) {
  const { toast } = useToast();
  const [likes, setLikes] = React.useState(post.likes || 0);
  const [isLiked, setIsLiked] = React.useState(false);
  const [comments, setComments] = React.useState<Comment[]>(post.comments || []);
  const [isCommentsVisible, setIsCommentsVisible] = React.useState(false);

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    toast({ title: isLiked ? 'Unliked' : 'Liked!', description: `You ${isLiked ? 'unliked' : 'liked'} this post.` });
  };

  const handleAddComment = (values: { text: string }) => {
    if (!currentUser) {
        toast({ title: 'Error', description: 'You must be logged in to comment.', variant: 'destructive' });
        return;
    }
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      text: values.text,
      createdAt: new Date().toISOString(),
      author: currentUser,
    };
    setComments(prevComments => [newComment, ...prevComments]);
  };

  const cardVariants = {
    hidden: { opacity: 0, filter: 'blur(10px)', y: 50 },
    visible: { 
      opacity: 1, 
      filter: 'blur(0px)', 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" } 
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3 }}
    >
      <LiquidGlass className="w-full max-w-2xl mx-auto">
        <div className="p-5">
          <div className="flex items-start gap-4">
            <Link href={`/profile/${post.author.username}`}>
              <Avatar className="w-12 h-12 border-2 border-white/30">
                <AvatarImage src={post.author.avatarUrl} alt={`${post.author.name}\'s avatar`} />
                <AvatarFallback className="bg-black/20 text-white">{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <Link href={`/profile/${post.author.username}`} className="font-bold text-white/90 hover:underline">
                  {post.author.name}
                </Link>
                <span className="text-sm text-white/60">@{post.author.username} Â· {timeAgo}</span>
              </div>
              <p className="mt-2 text-white/90 whitespace-pre-wrap">{post.content}</p>
            </div>
          </div>

          {post.imageUrl && (
            <div className="mt-4 rounded-2xl overflow-hidden border border-white/20 shadow-lg">
              <Image src={post.imageUrl} alt="Post image" width={500} height={500} className="w-full h-auto object-cover" />
            </div>
          )}

          <div className="mt-4 flex justify-around items-center border-t border-white/20 pt-2">
            <div className="flex items-center gap-1">
              <ActionButton onClick={() => setIsCommentsVisible(!isCommentsVisible)}>
                <MessageCircle size={20} />
              </ActionButton>
              <span className="text-sm min-w-[1rem] text-white/60">{comments.length > 0 ? comments.length : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <ActionButton><Repeat size={20} /></ActionButton>
              <span className="text-sm min-w-[1rem] text-white/60">{post.shares || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <ActionButton onClick={handleLike} active={isLiked}>
                <Heart size={20} className={isLiked ? 'fill-current' : ''} />
              </ActionButton>
              <span className="text-sm min-w-[1rem] text-white/60">{likes > 0 ? likes : ''}</span>
            </div>
            <ActionButton><Share size={20} /></ActionButton>
          </div>
        </div>

        {isCommentsVisible && (
          <div className="px-1">
            <CommentForm onSubmit={handleAddComment} isSubmitting={false} />
            <CommentList comments={comments} />
          </div>
        )}
      </LiquidGlass>
    </motion.div>
  );
}
