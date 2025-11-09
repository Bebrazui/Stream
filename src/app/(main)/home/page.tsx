import { PostCard } from '@/components/posts/post-card';
import { getPosts } from '@/lib/actions';

export default async function HomePage() {
  const posts = await getPosts();
  return (
    // By removing the wrapper with `h-full` and `overflow-y-auto`, we allow the parent layout to handle scrolling.
    // This div now only structures the immediate content.
    <div className="mx-auto flex max-w-2xl flex-col gap-4 py-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
