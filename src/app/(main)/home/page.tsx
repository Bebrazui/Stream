import { PostCard } from '@/components/posts/post-card';
import { posts } from '@/lib/data';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-headline text-3xl font-bold">Home</h1>
      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
