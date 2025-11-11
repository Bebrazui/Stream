import { PostCard } from '@/components/posts/post-card';
import { getPosts } from '@/lib/actions';
import { getSessionUser } from '@/lib/session';

export default async function HomePage() {
  const [posts, currentUser] = await Promise.all([
    getPosts(),
    getSessionUser(),
  ]);

  return (
    <div className="h-full overflow-y-auto snap-y snap-mandatory no-scrollbar">
      {posts.map((post) => (
        <div key={post.id} className="h-full snap-start flex items-center justify-center px-4">
          <PostCard post={post} currentUser={currentUser} />
        </div>
      ))}
    </div>
  );
}
