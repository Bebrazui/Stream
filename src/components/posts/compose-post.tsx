'use client';

import * as React from 'react';
import { useAuth } from '@/context/auth-context';
import { createPost } from '@/lib/actions';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LiquidGlass } from '@/components/layout/liquid-glass';
import { motion } from 'framer-motion';

export function ComposePost() {
  const { user } = useAuth();
  const [content, setContent] = React.useState('');
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!content.trim() || !user) return;

    startTransition(async () => {
      const result = await createPost(content);
      if (result.error) {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      } else {
        toast({ title: 'Success!', description: 'Your post has been published.' });
        setContent('');
        // Consider redirecting or updating the post list here
      }
    });
  };

  if (!user) {
    return null; // Don't show the form if not logged in
  }

  return (
    <LiquidGlass 
        as={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="p-4 rounded-2xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <Avatar className="border border-white/50 h-11 w-11">
            <AvatarImage src={user.avatarUrl ?? ''} alt={user.username} />
            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            maxLength={280}
            className="flex-1 bg-white/50 border-white/40 focus:ring-purple-500 text-gray-800 placeholder-gray-600 rounded-lg resize-none"
            rows={3}
          />
        </div>
        <div className="flex justify-end items-center gap-4">
          <span className="text-sm text-gray-600">{280 - content.length}</span>
          <Button 
            type="submit" 
            disabled={isPending || !content.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed"
          >
            {isPending ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </form>
    </LiquidGlass>
  );
}
