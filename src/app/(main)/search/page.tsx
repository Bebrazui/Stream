import { SearchClient } from '@/components/search/search-client';
import { users, posts } from '@/lib/data';

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-headline text-3xl font-bold">Search</h1>
      <SearchClient allUsers={users} allPosts={posts} />
    </div>
  );
}
