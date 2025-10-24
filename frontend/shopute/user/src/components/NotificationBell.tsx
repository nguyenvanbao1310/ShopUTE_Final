// NotificationBell.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Trash2 } from "lucide-react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../apis/notificationApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNotifications } from "../App";

interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string | null;
  createdAt: string;
}

export default function NotificationBell() {
  const [list, setList] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { user, isAuthenticated, token } = useSelector((s: RootState) => s.auth);
  const { notifications } = useNotifications();

  const loadedOnce = useRef(false); // chống gọi lặp vô ích

  // ✅ Re-fetch khi login xong & có token (tránh race)
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const abort = new AbortController();
    const run = async () => {
      try {
        // đảm bảo token đã sẵn trong localStorage (interceptor đọc được)
        const tk =
          localStorage.getItem("token") || localStorage.getItem("accessToken");
        if (!tk) {
          // chờ 1 tick ngắn nếu token vừa mới set
          await new Promise((r) => setTimeout(r, 0));
        }

        const res = await getNotifications();
        if (!abort.signal.aborted) {
          setList(res?.data?.data ?? []);
          loadedOnce.current = true;
          // console.log("✅ /nofi ->", res?.data);
        }
      } catch (err) {
        if (!abort.signal.aborted) {
          console.error("❌ getNotifications failed:", err);
          toast.error("Không thể tải thông báo");
        }
      }
    };

    run();
    return () => abort.abort();
    // ➜ phụ thuộc cả isAuthenticated, user.id, token (token đổi cũng refetch)
  }, [isAuthenticated, user?.id, token]);

  // ✅ Merge realtime, chống trùng theo id
  useEffect(() => {
    if (notifications.length === 0) return;
    const newNotif = notifications[0];

    setList((prev) => {
      const exists = prev.some((n) => n.id === newNotif.id);
      return exists ? prev : [newNotif, ...prev];
    });
  }, [notifications]);

  const unreadCount = useMemo(
    () => list.filter((n) => !n.isRead).length,
    [list]
  );

  const handleClick = async (n: Notification) => {
    if (!n.isRead) {
      try {
        await markAsRead(n.id);
        setList((prev) =>
          prev.map((i) => (i.id === n.id ? { ...i, isRead: true } : i))
        );
      } catch {
        toast.error("Không thể đánh dấu đã đọc");
      }
    }
    if (n.actionUrl) navigate(n.actionUrl);
    setOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setList((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("Đã đánh dấu tất cả là đã đọc");
    } catch {
      toast.error("Không thể đánh dấu tất cả");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id);
      setList((prev) => prev.filter((n) => n.id !== id));
      toast.success("Đã xóa thông báo");
    } catch {
      toast.error("Không thể xóa thông báo");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative text-gray-600 hover:text-orange-600"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white border rounded-lg shadow-lg z-50">
          <div className="p-3 border-b flex justify-between items-center">
            <h4 className="font-semibold text-gray-800 text-sm">Thông báo</h4>
            {list.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-orange-600 hover:underline"
              >
                Đọc tất cả
              </button>
            )}
          </div>

          <ul className="max-h-80 overflow-y-auto">
            {list.length === 0 ? (
              <p className="text-sm text-gray-500 p-3 text-center">
                Không có thông báo
              </p>
            ) : (
              list.map((n) => (
                <li
                  key={n.id}
                  className={`px-3 py-2 flex justify-between items-start cursor-pointer hover:bg-gray-50 ${
                    n.isRead ? "text-gray-400" : "text-gray-900 font-medium"
                  }`}
                >
                  <div className="flex-1" onClick={() => handleClick(n)}>
                    <div>{n.title}</div>
                    <div className="text-sm text-gray-600">{n.message}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <Trash2
                    size={16}
                    className="ml-2 text-gray-400 hover:text-red-500"
                    onClick={() => handleDelete(n.id)}
                  />
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
