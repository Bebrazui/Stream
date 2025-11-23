import { useState, useEffect } from 'react';
import { Post } from '@/types';
import { placeholderPosts } from '@/lib/placeholder-data';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Имитация загрузки данных
      setTimeout(() => {
        setPosts(placeholderPosts);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to fetch posts');
      setIsLoading(false);
    }
  }, []);

  return { posts, isLoading, error };
}
