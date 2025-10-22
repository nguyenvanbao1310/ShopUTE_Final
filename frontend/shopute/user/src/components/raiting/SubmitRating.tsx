import { FC } from "react";
import { Star } from "lucide-react";

export type RewardType = "points" | "coupon";

interface SubmitRatingProps {
  isAuthenticated: boolean;
  myRating: number;
  setMyRating: (v: number) => void;
  myComment: string;
  setMyComment: (v: string) => void;
  rewardType: RewardType;
  setRewardType: (v: RewardType) => void;
  submitReview: () => void;
  submitMsg: string;
}

const SubmitRating: FC<SubmitRatingProps> = ({
  isAuthenticated,
  myRating,
  setMyRating,
  myComment,
  setMyComment,
  rewardType,
  setRewardType,
  submitReview,
  submitMsg,
}) => {
  if (!isAuthenticated) return null;

  return (
    <div className="border rounded-lg p-4 bg-white mb-6">
      <h3 className="font-semibold mb-2">Đánh giá sản phẩm</h3>
      <div className="flex items-center mb-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setMyRating(n)} className="mr-1">
            <Star
              size={20}
              className={
                n <= myRating ? "text-yellow-400 fill-current" : "text-gray-300"
              }
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">{myRating || 0}/5</span>
      </div>
      <textarea
        value={myComment}
        onChange={(e) => setMyComment(e.target.value)}
        placeholder="Chia sẻ cảm nhận của bạn..."
        className="w-full border rounded p-2 mb-3"
        rows={3}
      />
      <div className="flex items-center mb-3">
        <label className="mr-3 text-sm">Nhận thưởng:</label>
        <label className="mr-4 text-sm">
          <input
            type="radio"
            name="rewardType"
            value="points"
            checked={rewardType === "points"}
            onChange={() => setRewardType("points")}
          />{" "}
          Điểm
        </label>
        <label className="text-sm">
          <input
            type="radio"
            name="rewardType"
            value="coupon"
            checked={rewardType === "coupon"}
            onChange={() => setRewardType("coupon")}
          />{" "}
          Mã giảm giá
        </label>
      </div>
      <button
        onClick={submitReview}
        disabled={myRating < 1}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
      >
        Gửi đánh giá
      </button>
      {submitMsg && <p className="mt-2 text-sm text-green-600">{submitMsg}</p>}
    </div>
  );
};

export default SubmitRating;

