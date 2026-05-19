import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchPosts, Post, searchPosts } from '~/services/postService';

const DEBOUNCE_MS = 500;

interface UsePostsState {
  posts: Post[];
  loading: boolean;
  refreshing: boolean;
  error: string;
  query: string;
  setQuery: (value: string) => void;
  onRefresh: () => void;
}

export function usePosts(): UsePostsState {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const mountedRef = useRef(true);
  const skipQueryEffectRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const updateState = useCallback((nextPosts: Post[], nextError = '') => {
    if (!mountedRef.current) return;
    setPosts(nextPosts);
    setError(nextError);
  }, []);

  const fetchData = useCallback(
    async (options: { query?: string; isRefresh?: boolean } = {}) => {
      const trimmedQuery = options.query?.trim() ?? '';
      const isRefresh = options.isRefresh ?? false;

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const data = trimmedQuery ? await searchPosts(trimmedQuery) : await fetchPosts();
        updateState(data);
      } catch {
        updateState([], 'Nao foi possivel carregar os posts.');
      } finally {
        if (!mountedRef.current) return;
        setLoading(false);
        setRefreshing(false);
      }
    },
    [updateState],
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchData();
    }, 0);

    return () => clearTimeout(handler);
  }, [fetchData]);

  useEffect(() => {
    if (skipQueryEffectRef.current) {
      skipQueryEffectRef.current = false;
      return;
    }

    const handler = setTimeout(() => {
      fetchData({ query });
    }, DEBOUNCE_MS);

    return () => clearTimeout(handler);
  }, [fetchData, query]);

  const onRefresh = useCallback(() => {
    fetchData({ query, isRefresh: true });
  }, [fetchData, query]);

  return {
    posts,
    loading,
    refreshing,
    error,
    query,
    setQuery,
    onRefresh,
  };
}
