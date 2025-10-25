'use client';

import React, { useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useOrderNotifications } from '@/hooks/notification';

export function NotificationMenu() {
  const { open, items, unread, loading, toggleOpen, fetchNotifications, setOpen } = useOrderNotifications();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!containerRef.current) return;
      if (containerRef.current.contains(e.target as Node)) return;
      setOpen(false);
    }
    if (open) {
      document.addEventListener('mousedown', onClickOutside);
    }
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open, setOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        className="p-2 hover:bg-gray-100 rounded-lg relative"
        onClick={() => {
          toggleOpen();
          if (!open) fetchNotifications();
        }}
        aria-label="Notifications"
      >
        <Bell size={20} className="text-gray-600" />
        {unread > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <span className="font-semibold">Thông báo đơn hàng</span>
            <button className="text-sm text-blue-600 hover:underline" onClick={() => fetchNotifications()}>
              Làm mới
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading && <div className="p-4 text-sm text-gray-500">Đang tải...</div>}
            {!loading && items.length === 0 && (
              <div className="p-4 text-sm text-gray-500">Không có thông báo</div>
            )}
            {!loading &&
              items.map((n) => (
                <div key={n.id} className="px-4 py-3 hover:bg-gray-50">
                  <div className="text-sm font-medium text-gray-900">{n.title}</div>
                  <div className="text-sm text-gray-600">{n.message}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString('vi-VN')}</div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
