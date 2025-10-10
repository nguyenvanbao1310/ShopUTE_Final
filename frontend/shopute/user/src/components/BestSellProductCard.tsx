import { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { wishlistApi } from "../apis/wishlistApi";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  finalPrice: string;
  discountPercent: string;
  sold: string;
  thumbnailUrl: string;
  Category: Category;
}

const BestSellProductCard: FC<{ product: Product }> = ({ product }) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const res = await wishlistApi.getWishlist();
        // Nếu backend trả res.data
        const wishlist = res.data.items;
        const exists = wishlist.some(
          (item: any) => item.productId === product.id
        );
        if (exists) setLiked(true);
      } catch (err) {
        console.error("Error checking wishlist:", err);
      }
    };
    checkWishlist();
  }, [product.id]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (liked) {
        await wishlistApi.removeFromWishlist(product.id);
        setLiked(false);
      } else {
        await wishlistApi.addToWishlist(product.id);
        setLiked(true);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  return (
    <div className="relative border rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer">
      {/* Nút wishlist */}
      <button onClick={toggleWishlist} className="absolute top-2 right-2 z-10">
        <Heart
          size={20}
          className={`${
            liked ? "text-red-500 fill-red-500" : "text-gray-400"
          } transition`}
        />
      </button>

      {/* Label giảm giá */}
      {parseFloat(product.discountPercent) > 0 && (
        <span className="absolute top-2 left-2 bg-pink-600 text-white text-xs px-2 py-1 rounded">
          -{product.discountPercent}%
        </span>
      )}

      <Link to={`/product/${product.id}`}>
        {/* Ảnh sản phẩm */}
        <img
          src={product.thumbnailUrl}
          alt={product.name}
          className="w-full h-32 object-contain"
        />
      </Link>

      <div className="mt-3 leading-relaxed">
        <p className="text-sm text-gray-500">{product.Category?.name}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-base md:text-lg font-semibold text-gray-800 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Giá */}
        <div className="mt-2">
          {parseFloat(product.discountPercent) > 0 && (
            <span className="text-gray-400 line-through text-sm mr-2">
              {Number(product.price).toLocaleString()}₫
            </span>
          )}
          <span className="text-pink-600 font-bold text-lg">
            {Number(product.finalPrice).toLocaleString()}₫
          </span>
        </div>

        {/* Sold count */}
        <div className="flex items-center mt-2 text-sm text-gray-600">
          <Star
            size={16}
            className="text-yellow-500 mr-1"
            fill="currentColor"
          />
          <span>Đã bán {product.sold}</span>
        </div>
      </div>
    </div>
  );
};

export default BestSellProductCard;
