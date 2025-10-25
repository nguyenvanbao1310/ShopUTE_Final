'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import apiClient from '@/lib/api';
import type { OrderNotification } from '@/types/notification';

export function useOrderNotifications() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<OrderNotification[]>([]);
  const fetchedRef = useRef(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<OrderNotification[]>('/notifications');
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (open && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchNotifications();
    }
  }, [open, fetchNotifications]);

  // Fetch once on mount so the badge can show without clicking
  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchNotifications();
    }
    // Optional: lightweight polling to keep badge fresh
    const id = setInterval(() => {
      fetchNotifications();
    }, 60000);
    return () => clearInterval(id);
  }, [fetchNotifications]);

  const unread = useMemo(() => items.length, [items]);

  return {
    open,
    loading,
    items,
    unread,
    toggleOpen,
    fetchNotifications,
    setOpen,
  };
}

export default useOrderNotifications;
