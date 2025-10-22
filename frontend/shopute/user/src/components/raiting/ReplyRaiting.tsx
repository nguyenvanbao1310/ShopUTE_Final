import React, { FC, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { createReply, fetchReplies, ReplyItem } from '../../apis/adminReplies';

interface Props {
  ratingId: number;
}

const ReplyRaiting: FC<Props> = ({ ratingId }) => {
  const isAdmin = useSelector((s: any) => (s?.auth?.user?.role || '').toLowerCase() === 'admin');
  const [replies, setReplies] = useState<ReplyItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => msg.trim().length > 0 && msg.trim().length <= 1000, [msg]);

  const loadReplies = async () => {
    try {
      setLoading(true);
      const data = await fetchReplies(ratingId);
      setReplies(Array.isArray(data) ? data : []);
    } catch {
      setReplies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratingId]);

  const onSubmit = async () => {
    if (!isAdmin || !canSubmit) return;
    try {
      setPosting(true);
      setError(null);
      await createReply(ratingId, msg.trim());
      setMsg('');
      setOpen(false);
      await loadReplies();
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Gửi phản hồi thất bại';
      setError(msg);
    } finally {
      setPosting(false);
    }
  };

  const sorted = useMemo(
    () => [...replies].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [replies]
  );
  const [showAll, setShowAll] = useState(false);
  const visible = useMemo(() => {
    if (showAll) return sorted;
    if (sorted.length <= 1) return sorted;
    // show oldest 1 by default when there are more than 2 (list is ASC)
    return sorted.slice(0, 1);
  }, [sorted, showAll]);

  return (
    <div className="mt-2">
      {/* Replies list */}
      {sorted.length > 0 && (
        <div className="mt-2 space-y-2">
          {visible.map((r) => (
            <div key={r.id} className="text-sm text-gray-700 bg-gray-50 border rounded p-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{r.adminName || 'Admin'}</span>
                <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</span>
              </div>
              <div className="mt-1 whitespace-pre-wrap">{r.message}</div>
            </div>
          ))}
          {sorted.length > 1 && (
            <div className="flex justify-center pt-1">
              {!showAll ? (
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:underline"
                  onClick={() => setShowAll(true)}
                  aria-label="Hiển thị thêm phản hồi"
                >
                  Hiển thị thêm ({sorted.length - 1})
                </button>
              ) : (
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:underline"
                  onClick={() => setShowAll(false)}
                  aria-label="Thu gọn phản hồi"
                >
                  
                  Thu gọn
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bottom-right reply action for admins */}
      {isAdmin && (
        <div className="flex justify-end mt-2">
          {!open ? (
            <button
              className="text-blue-600 hover:underline text-sm"
              onClick={() => setOpen(true)}
            >
              Reply
            </button>
          ) : (
            <div className="w-full">
              <textarea
                className="w-full border rounded p-2 text-sm"
                rows={3}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Nhập phản hồi (tối đa 1000 ký tự)"
              />
              {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
              <div className="flex justify-end gap-2 mt-1">
                <button
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                  onClick={() => {
                    setOpen(false);
                    setMsg('');
                    setError(null);
                  }}
                  disabled={posting}
                >
                  Hủy
                </button>
                <button
                  className={`px-3 py-1.5 rounded text-sm ${
                    canSubmit ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                  onClick={onSubmit}
                  disabled={!canSubmit || posting}
                >
                  Gửi
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReplyRaiting;
