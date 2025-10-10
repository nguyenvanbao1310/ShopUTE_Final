import { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { wishlistApi } from "../apis/wishlistApi";

interface ProductProps {
  id: number;
  name: string;
  price: string;
  finalPrice: string;
  discountPercent: string;
  thumbnailUrl: string;
}

const ProductMostViewCard: FC<{ product: ProductProps }> = ({ product }) => {
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
      className="relative flex items-center border p-3 rounded-lg cursor-pointer hover:shadow-lg hover:-translate-y-1 transition"
    >
      {/* Icon tim */}
      <button onClick={toggleWishlist} className="absolute top-2 right-2 z-10">
        <Heart
          size={20}
          stroke={liked ? "red" : "gray"}
          fill={liked ? "red" : "white"}
          className="transition"
        />
      </button>
      <Link to={`/product/${product.id}`}>
        <img
          src={product.thumbnailUrl}
          alt={product.name}
          className="w-16 h-16 object-contain"
        />
      </Link>

      <div className="ml-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center mt-1">
          {parseFloat(product.discountPercent) > 0 && (
            <span className="text-gray-400 line-through text-xs mr-2">
              {Number(product.price).toLocaleString()}₫
            </span>
          )}
          <span className="text-indigo-600 font-semibold text-base">
            {Number(product.finalPrice).toLocaleString()}₫
          </span>
          {parseFloat(product.discountPercent) > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">
              -{product.discountPercent}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductMostViewCard;
