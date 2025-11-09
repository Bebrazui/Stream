import type { Post } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Repeat, Share, Link as LinkIcon } from 'lucide-react';

export function PostCard({ post }: { post: Post }) {
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    // Reverted to a card-based layout with a max-width.
    <Card className="w-full max-w-2xl overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg">
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <Link href={`/profile/${post.author.username}`}>
          <Avatar>
            <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col">
          <Link href={`/profile/${post.author.username}`} className="font-bold hover:underline">
            {post.author.name}
          </Link>
          <p className="text-sm text-muted-foreground">
            @{post.author.username} · {timeAgo}
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-2 pt-0">
        <p className="whitespace-pre-wrap">{post.content}</p>
        {post.imageUrl && (
          <div className="relative mt-4 overflow-hidden rounded-lg border">
            <Image
              src={post.imageUrl}
              alt="Post image"
              width={600}
              height={400}
              className="aspect-[3/2] w-full object-cover"
              data-ai-hint="post image"
            />
          </div>
        )}
        {post.linkUrl && (
          <a
            href={post.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center gap-3 rounded-lg border p-3 hover:bg-secondary"
          >
            <LinkIcon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
            <div className="min-w-0">
                <p className="truncate text-sm font-medium">{post.linkUrl}</p>
            </div>
          </a>
        )}
      </CardContent>
      <CardFooter className="px-4 pb-3 pt-2">
        <div className="flex w-full justify-between text-muted-foreground">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <span>{post.comments}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Repeat className="h-5 w-5" />
            <span>{post.shares}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            <span>{post.likes}</span>
          </Button>
          <Button variant="ghost" size="sm">
            <Share className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
