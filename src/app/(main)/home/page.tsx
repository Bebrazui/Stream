import { PostCard } from '@/components/posts/post-card';
import { getPosts } from '@/lib/actions';

export default async function HomePage() {
  const posts = await getPosts();
  return (
    // The container now has a defined height and enables snapping
    <div className="h-full w-full snap-y snap-mandatory overflow-y-scroll">
      {/* Each child is a snap point, filling the height of the container */}
      {posts.map((post) => (
        <div key={post.id} className="flex h-full w-full snap-start items-center justify-center py-6">
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}
