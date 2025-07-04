'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { tagService, Tag } from '@/lib/api';

interface TagsContextType {
  popularTags: Tag[];
  loading: boolean;
  error: string | null;
  refetchTags: () => Promise<void>;
}

const TagsContext = createContext<TagsContextType | undefined>(undefined);

export function TagsProvider({ children }: { children: ReactNode }) {
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPopularTags = async () => {
    try {
      setLoading(true);
      setError(null);
      const tags = await tagService.getPopularTags(10);
      setPopularTags(tags);
    } catch (err) {
      setError('Failed to load popular tags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPopularTags();
  }, []);

  const refetchTags = async () => {
    await loadPopularTags();
  };

  return (
    <TagsContext.Provider value={{ popularTags, loading, error, refetchTags }}>
      {children}
    </TagsContext.Provider>
  );
}

export function useTags() {
  const context = useContext(TagsContext);
  if (context === undefined) {
    throw new Error('useTags must be used within a TagsProvider');
  }
  return context;
}
