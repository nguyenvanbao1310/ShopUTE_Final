import { FC, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import SubmitRating, { RewardType } from "../raiting/SubmitRating";
import ManageRatings, { RatingItem } from "../raiting/ManageRatings";
import { createProductRating, fetchProductRatings, updateRating } from "../../apis/rating";

// Types moved to child components

interface Props {
  productId: number;
}

const RatingSection: FC<Props> = ({ productId }) => {
  const isAuthenticated = useSelector((s: any) => s?.auth?.isAuthenticated);
  const currentUserId = useSelector((s: any) => s?.auth?.user?.id);

  const [ratings, setRatings] = useState<RatingItem[]>([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const [starFilter, setStarFilter] = useState<number | null>(null); // null = Tất cả

  const [myRating, setMyRating] = useState<number>(0);
  const [myComment, setMyComment] = useState<string>("");
  const [rewardType, setRewardType] = useState<RewardType>("points");
  const [submitMsg, setSubmitMsg] = useState<string>("");

  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [editing, setEditing] = useState<{
    id: number;
    rating: number;
    comment: string;
  } | null>(null);

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    setRatingsLoading(true);
    fetchProductRatings(productId)
      .then((data) => mounted.current && setRatings(data || []))
      .catch(() => mounted.current && setRatings([]))
      .finally(() => mounted.current && setRatingsLoading(false));
    return () => {
      mounted.current = false;
    };
  }, [productId]);

  const refreshRatings = async () => {
    const data = await fetchProductRatings(productId);
    if (mounted.current) setRatings(data || []);
  };

  const submitReview = async () => {
    setSubmitMsg("");
    try {
      const res = await createProductRating(productId, {
        rating: myRating,
        comment: myComment,
        rewardType,
      });
      await refreshRatings();
      if ((res as any)?.reward?.type === "coupon") {
        setSubmitMsg(
          `Cảm ơn bạn! Tặng mã giảm giá ${(res as any).reward.code} (-${
            (res as any).reward.percent
          }%).`
        );
      } else if ((res as any)?.reward?.type === "points") {
        setSubmitMsg("Cảm ơn bạn! Bạn đã nhận điểm thưởng.");
      }
      setMyRating(0);
      setMyComment("");
    } catch (e: any) {
      setSubmitMsg(e?.response?.data?.message || "Không thể gửi đánh giá.");
    }
  };

  const onClickEdit = (r: RatingItem) => {
    setMenuOpenId(null);
    setEditing({ id: r.id, rating: r.rating, comment: r.comment || "" });
  };

  const onSaveEdit = async () => {
    if (!editing) return;
    try {
      await updateRating(editing.id, {
        rating: editing.rating,
        comment: editing.comment,
      });
      setEditing(null);
      await refreshRatings();
    } catch (e) {
      // no-op or show toast
    }
  };

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length
      : 0;

  const filteredRatings = starFilter
    ? ratings.filter((r) => Math.round(r.rating || 0) === starFilter)
    : ratings;

  return (
    <div>
      {/* Submit section */}
      <SubmitRating
        isAuthenticated={isAuthenticated}
        myRating={myRating}
        setMyRating={setMyRating}
        myComment={myComment}
        setMyComment={setMyComment}
        rewardType={rewardType}
        setRewardType={setRewardType}
        submitReview={submitReview}
        submitMsg={submitMsg}
      />

      {/* Filter controls */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {[
          { label: "Tất cả", value: null },
          { label: "5 sao", value: 5 },
          { label: "4 sao", value: 4 },
          { label: "3 sao", value: 3 },
          { label: "2 sao", value: 2 },
          { label: "1 sao", value: 1 },
        ].map((opt) => (
          <button
            key={String(opt.value)}
            onClick={() => setStarFilter(opt.value as any)}
            className={
              (starFilter === opt.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200") +
              " px-3 py-1.5 rounded text-sm"
            }
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Manage (edit) section */}
      <ManageRatings
        ratings={filteredRatings}
        ratingsLoading={ratingsLoading}
        isAuthenticated={isAuthenticated}
        currentUserId={currentUserId}
        menuOpenId={menuOpenId}
        setMenuOpenId={setMenuOpenId}
        editing={editing}
        setEditing={setEditing}
        onClickEdit={onClickEdit}
        onSaveEdit={onSaveEdit}
      />
    </div>
  );
};

export default RatingSection;
