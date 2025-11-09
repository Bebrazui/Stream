import { SearchClient } from '@/components/search/search-client';
import { getPosts } from '@/lib/actions';
import type { User } from '@/types';

export default async function SearchPage() {
  const allPosts = await getPosts();

  // Extract unique users from posts
  const usersMap = new Map<string, User>();
  allPosts.forEach((post) => {
    if (post.author && !usersMap.has(post.author.id)) {
      usersMap.set(post.author.id, post.author);
    }
  });
  const allUsers = Array.from(usersMap.values());

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-headline text-3xl font-bold">Search</h1>
      <SearchClient allUsers={allUsers} allPosts={allPosts} />
    </div>
  );
}
