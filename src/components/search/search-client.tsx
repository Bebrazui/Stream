'use client';

import { useState, useMemo } from 'react';
import type { User, Post } from '@/types';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PostCard } from '@/components/posts/post-card';
import { Card, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Search as SearchIcon } from 'lucide-react';

type SearchClientProps = {
  allUsers: User[];
  allPosts: Post[];
};

export function SearchClient({ allUsers, allPosts }: SearchClientProps) {
  const [query, setQuery] = useState('');

  const filteredUsers = useMemo(() => {
    if (!query) return [];
    return allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allUsers]);

  const filteredPosts = useMemo(() => {
    if (!query) return [];
    return allPosts.filter((post) =>
      post.content.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allPosts]);

  const hasResults = filteredUsers.length > 0 || filteredPosts.length > 0;

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto px-4 py-6">
        <h1 className="mb-6 font-headline text-3xl font-bold">Search</h1>
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for users or posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {query && !hasResults && (
          <div className="py-12 text-center text-muted-foreground">
            <p>No results found for "{query}"</p>
          </div>
        )}

        {query && hasResults && (
          <div className="flex flex-col gap-8">
            {filteredUsers.length > 0 && (
              <section>
                <h2 className="mb-4 font-headline text-xl font-semibold">Users</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredUsers.map((user) => (
                    <Link href={`/profile/${user.username}`} key={user.id}>
                      <Card className="transition-shadow duration-300 ease-in-out hover:shadow-md">
                        <CardHeader className="flex flex-row items-center gap-4 p-4">
                          <Avatar>
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold">{user.name}</p>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {filteredPosts.length > 0 && (
              <section>
                <h2 className="mb-4 font-headline text-xl font-semibold">Posts</h2>
                <div className="flex flex-col gap-4">
                  {filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {!query && (
          <div className="py-12 text-center text-muted-foreground">
            <p>Start typing to search for users and posts.</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
