'use client';

import { SiteSidebar } from "@/components/layout/site-sidebar";
import { PostList } from "@/components/posts/post-list";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import type { Post } from "@/types";
import { getPosts } from "@/lib/actions";

export default function Home() {
  const { user: currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="grid grid-cols-12 min-h-screen">
      <div className="col-span-2 border-r border-white/10">
        <SiteSidebar />
      </div>
      <main className="col-span-7 py-8">
        <PostList posts={posts} isLoading={loading} />
      </main>
      <aside className="col-span-3 border-l border-white/10">
        <RightSidebar />
      </aside>
    </div>
  );
}
