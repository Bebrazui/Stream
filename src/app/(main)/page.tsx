'use client';

import { Feed } from '@/components/feed/feed';
import { CreatePost } from '@/components/post/create-post';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="mx-auto flex flex-col items-center">
      {session && <CreatePost />} 
      <Feed />
    </div>
  );
}
