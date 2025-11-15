'use client';

import { useState, useMemo } from 'react';
import type { User, Post } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PostCard } from '@/components/posts/post-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Search as SearchIcon } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';


type SearchClientProps = {
  allUsers: User[];
  allPosts: Post[];
};

export function SearchClient({ allUsers, allPosts }: SearchClientProps) {
  const [query, setQuery] = useState('');

  const lowercasedQuery = query.toLowerCase();

  const filteredContent = useMemo(() => {
    if (!lowercasedQuery) {
      return { users: [], posts: allPosts }; // Show all posts by default
    }

    const users = allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(lowercasedQuery) ||
        user.username.toLowerCase().includes(lowercasedQuery)
    );

    const posts = allPosts.filter((post) =>
      post.content.toLowerCase().includes(lowercasedQuery) ||
      post.author.name.toLowerCase().includes(lowercasedQuery) ||
      post.author.username.toLowerCase().includes(lowercasedQuery)
    );

    return { users, posts };
  }, [lowercasedQuery, allUsers, allPosts]);

  const hasResults = filteredContent.users.length > 0 || filteredContent.posts.length > 0;
  const showInitialState = !query;

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto px-4 py-6">
        <div className="sticky top-0 z-10 backdrop-blur-md bg-transparent -mx-4 px-4 mb-6">
            <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60" />
                 <input
                    type="search"
                    placeholder="Search anything..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-black/30 backdrop-blur-lg border border-white/20 rounded-full py-3 pl-12 pr-4 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-all"
                />
            </div>
        </div>

        {showInitialState ? (
             <div className="flex flex-col gap-4">
                <h2 className="font-headline text-2xl font-semibold text-white/90">Recent Posts</h2>
                 {filteredContent.posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        ) : hasResults ? (
          <div className="flex flex-col gap-8">
            {filteredContent.users.length > 0 && (
              <section>
                <h2 className="mb-4 font-headline text-2xl font-semibold text-white/90">Users</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredContent.users.map((user) => (
                    <Link href={`/profile/${user.username}`} key={user.id}>
                        <LiquidGlass as="div" className='p-1'>
                            <div className="flex flex-row items-center gap-4 p-4">
                                <Avatar className='w-12 h-12 border-2 border-white/30'>
                                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-white/95">{user.name}</p>
                                    <p className="text-sm text-white/70">@{user.username}</p>
                                </div>
                            </div>
                        </LiquidGlass>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {filteredContent.posts.length > 0 && (
              <section>
                <h2 className="mb-4 font-headline text-2xl font-semibold text-white/90">Posts</h2>
                <div className="flex flex-col gap-4">
                  {filteredContent.posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="py-12 text-center text-white/60">
            <p className='text-lg'>No results found for "{query}"</p>
            <p className='text-sm text-white/50'>Try searching for something else.</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
