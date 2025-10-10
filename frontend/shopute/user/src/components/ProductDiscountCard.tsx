import { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { wishlistApi } from "../apis/wishlistApi";
import { Heart } from "lucide-react";

interface ProductProps {
  id: number;
  name: string;
  price: string;
  finalPrice: string;
  discountPercent: string;
  thumbnailUrl: string;
}

const ProductDiscountCard: FC<{ product: ProductProps }> = ({ product }) => {
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
    <div
      key={product.id}
      className="relative border rounded-xl shadow hover:shadow-lg cursor-pointer transition group"
    >
      {/* Wishlist icon */}
      <button onClick={toggleWishlist} className="absolute top-2 right-2 z-10">
        <Heart
          size={24}
          stroke={liked ? "red" : "gray"}
          fill={liked ? "red" : "white"}
          className="transition"
        />
      </button>

      {/* Image wrapper */}
      <div className="relative bg-gray-50 rounded-t-xl flex items-center justify-center h-44">
        {/* Badge Sale */}
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          -{parseFloat(product.discountPercent)}%
        </span>

        <Link to={`/product/${product.id}`}>
          <img
            src={product.thumbnailUrl}
            alt={product.name}
            className="max-h-36 object-contain"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-pink-600 transition">
            {product.name}
          </h3>
        </Link>

        {/* Prices */}
        <div className="mt-2">
          <span className="text-lg font-bold text-red-500">
            {(parseFloat(product.finalPrice) || 0).toLocaleString()}₫
          </span>
          <span className="ml-2 text-sm line-through text-gray-400">
            {(parseFloat(product.price) || 0).toLocaleString()}₫
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductDiscountCard;
