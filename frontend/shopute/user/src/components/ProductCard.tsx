import { FC, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { addToCart } from "../store/cartSlice";
import { wishlistApi } from "../apis/wishlistApi";
import { Heart } from "lucide-react";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  thumbnailUrl?: string;
}

const ProductCard: FC<ProductCardProps> = ({
  id,
  name,
  price,
  thumbnailUrl,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [liked, setLiked] = useState(false);
  const formatPrice = (value: number) => {
    return value.toLocaleString("vi-VN") + " VNĐ";
  };

  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const res = await wishlistApi.getWishlist();
        // Nếu backend trả res.data
        const wishlist = res.data.items;
        const exists = wishlist.some((item: any) => item.productId === id);
        if (exists) setLiked(true);
      } catch (err) {
        console.error("Error checking wishlist:", err);
      }
    };
    checkWishlist();
  }, [id]);

  // Toggle wishlist
  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (liked) {
        await wishlistApi.removeFromWishlist(id);
        setLiked(false);
      } else {
        await wishlistApi.addToWishlist(id);
        setLiked(true);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  return (
    <div className="relative bg-white rounded-xl shadow-lg p-4 hover:shadow-2xl transition-shadow duration-300  cursor-pointer">
      {/* Nút yêu thích */}
      <button onClick={toggleWishlist} className="absolute top-2 right-2 z-10">
        <Heart
          size={28}
          stroke={liked ? "red" : "gray"}
          fill={liked ? "red" : "white"}
          className="transition"
        />
      </button>
      <img
        src={thumbnailUrl || "/placeholder.png"}
        alt={name}
        className="w-full h-40 object-contain rounded"
      />
      <h3 className="mt-2 font-semibold text-gray-800">{name}</h3>
      <p className="text-pink-600 font-bold">{formatPrice(Number(price))}</p>
      <button
        className="mt-2 w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
        onClick={() => dispatch(addToCart({ productId: id, quantity: 1 }))}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
