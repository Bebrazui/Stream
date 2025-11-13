'use client';

import { PostList } from '@/components/posts/post-list';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="mx-auto flex flex-col items-center">
      {/* The CreatePost component should be on its own page, e.g., /compose */}
      <PostList />
    </div>
  );
}
