import { PostCard } from '@/components/posts/post-card';
import { getPosts } from '@/lib/actions';

export default async function HomePage() {
  const posts = await getPosts();
  return (
    <div className="h-full overflow-y-auto snap-y snap-mandatory scroll-smooth no-scrollbar">
      {posts.map((post) => (
        <div key={post.id} className="h-full snap-start flex items-center justify-center">
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}
