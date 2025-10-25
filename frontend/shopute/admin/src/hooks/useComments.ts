'use client';

import { useCallback, useEffect, useState } from 'react';
import apiClient from '@/lib/api';
import type { AdminComment } from '@/types/comment';

export type CommentsFilters = {
  limit?: number;
};

export function useComments(initial: CommentsFilters = { limit: 100 }) {
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<CommentsFilters>(initial);

  const fetchComments = useCallback(async (f: CommentsFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (f.limit && Number.isFinite(f.limit) && f.limit! > 0) {
        params.set('limit', String(Math.floor(f.limit!)));
      }
      const qs = params.toString();
      const endpoint = qs ? `/comments/flagged?${qs}` : '/comments/flagged';
      const data = await apiClient.get<AdminComment[]>(endpoint);
      setComments(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments(filters);
  }, [filters, fetchComments]);

  return {
    comments,
    loading,
    filters,
    setFilters,
    fetchComments,
  };
}

