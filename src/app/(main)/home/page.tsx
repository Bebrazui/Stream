import PostCard from '@/components/posts/post-card';
import { getPosts } from '@/lib/actions';

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="h-full overflow-y-auto snap-y snap-mandatory no-scrollbar">
      {posts.map((post) => (
        <div key={post.id} className="snap-start py-4">
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}
