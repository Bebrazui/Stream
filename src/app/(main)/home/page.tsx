import { PostList } from '@/components/posts/post-list';

export default function HomePage() {
  return (
    <div className="h-full overflow-y-auto no-scrollbar p-4">
      <PostList />
    </div>
  );
}
