'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types';
import { getPosts } from '@/lib/actions';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        setError('Failed to fetch posts');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, isLoading, error };
}
