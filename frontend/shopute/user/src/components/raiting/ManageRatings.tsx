import { FC } from "react";
import { Star, MoreVertical } from "lucide-react";

export interface RatingItem {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: { name: string };
}

interface ManageRatingsProps {
  ratings: RatingItem[];
  ratingsLoading: boolean;
  isAuthenticated: boolean;
  currentUserId?: number;
  menuOpenId: number | null;
  setMenuOpenId: (v: number | null) => void;
  editing: { id: number; rating: number; comment: string } | null;
  setEditing: (v: { id: number; rating: number; comment: string } | null) => void;
  onClickEdit: (r: RatingItem) => void;
  onSaveEdit: () => void;
}

const ManageRatings: FC<ManageRatingsProps> = ({
  ratings,
  ratingsLoading,
  isAuthenticated,
  currentUserId,
  menuOpenId,
  setMenuOpenId,
  editing,
  setEditing,
  onClickEdit,
  onSaveEdit,
}) => {
  if (ratingsLoading) return <p>Đang tải đánh giá...</p>;
  if (!ratings || ratings.length === 0)
    return <p className="text-gray-600">Chưa có đánh giá nào.</p>;

  return (
    <div className="space-y-4">
      {ratings.map((r) => (
        <div key={r.id} className="border p-4 rounded bg-white relative">
          <div className="flex items-center justify-between">
            <div className="font-semibold">{r.user?.name || "User"}</div>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.round(r.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }
                />
              ))}
              {(() => {
                const createdAt = new Date(r.createdAt);
                const canEdit =
                  isAuthenticated &&
                  currentUserId === r.userId &&
                  Date.now() - createdAt.getTime() <= 30 * 24 * 60 * 60 * 1000;
                if (!canEdit) return null;
                return (
                  <div className="relative">
                    <button
                      aria-label="More actions"
                      className="p-1 hover:bg-gray-100 rounded"
                      onClick={() => setMenuOpenId(menuOpenId === r.id ? null : r.id)}
                    >
                      <MoreVertical size={18} />
                    </button>
                    {menuOpenId === r.id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow z-10">
                        <button
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                          onClick={() => onClickEdit(r)}
                        >
                          Chỉnh sửa
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
          {r.comment && <p className="mt-2 text-gray-700">{r.comment}</p>}
          <div className="text-xs text-gray-400 mt-1">
            {new Date(r.createdAt).toLocaleString()}
          </div>

          {editing?.id === r.id && (
            <div className="mt-3 border-t pt-3">
              <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() =>
                      setEditing({ ...(editing as any), rating: n })
                    }
                    className="mr-1"
                  >
                    <Star
                      size={18}
                      className={
                        n <= (editing?.rating || 0)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {editing?.rating || 0}/5
                </span>
              </div>
              <textarea
                value={editing?.comment || ""}
                onChange={(e) =>
                  setEditing({ ...(editing as any), comment: e.target.value })
                }
                className="w-full border rounded p-2 mb-2"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={onSaveEdit}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Lưu
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ManageRatings;
