import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { wishlistApi } from "../../apis/wishlistApi";
import MainLayout from "../../layouts/MainLayout";

interface Product {
  id: number;
  name: string;
  brand?: string;
  price: string;
  finalPrice?: string;
  discountPercent?: string;
  stock?: number;
  thumbnailUrl: string;
}

const WishlistPage: FC = () => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await wishlistApi.getWishlist();
      const items = res.data.items || [];
      const products = items.map((item: any) => item.Product);
      setWishlist(products);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId: number) => {
    try {
      await wishlistApi.removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-extrabold mb-10 text-gray-800 text-center">
            Your Wishlist
          </h1>

          {loading ? (
            <p className="text-center text-gray-500 mt-16 text-lg">
              Loading wishlist...
            </p>
          ) : wishlist.length === 0 ? (
            <p className="text-center text-gray-500 mt-16 text-lg">
              Your wishlist is empty.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <div
                  key={product.id}
                  className="relative bg-white border rounded-2xl shadow-md p-4 flex flex-col h-full justify-between
                 hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-transform duration-300"
                >
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(product.id)}
                    title="Remove from wishlist"
                    className="absolute top-3 right-3 z-10"
                  >
                    <Heart
                      size={22}
                      className="text-red-500 fill-red-500 hover:scale-110 transition-transform duration-200"
                    />
                  </button>

                  {/* Discount badge */}
                  {product.discountPercent &&
                    parseFloat(product.discountPercent) > 0 && (
                      <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2 py-1 rounded font-semibold">
                        -{product.discountPercent}%
                      </span>
                    )}

                  <Link
                    to={`/product/${product.id}`}
                    className="flex justify-center"
                  >
                    <img
                      src={product.thumbnailUrl}
                      alt={product.name}
                      className="w-40 h-40 object-contain rounded-lg transition-transform hover:scale-105"
                    />
                  </Link>

                  <div className="mt-3 flex-1 flex flex-col justify-between">
                    <div className="text-center">
                      {product.brand && (
                        <p className="text-xs text-gray-400 truncate">
                          {product.brand}
                        </p>
                      )}
                      <Link to={`/product/${product.id}`}>
                        <h3 className="text-base font-medium text-gray-800 line-clamp-2 mt-1 hover:text-pink-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="mt-1 flex justify-center items-center gap-2">
                        {product.discountPercent &&
                          parseFloat(product.discountPercent) > 0 && (
                            <span className="text-gray-400 line-through text-sm">
                              {Number(product.price).toLocaleString()}₫
                            </span>
                          )}
                        <span className="text-pink-600 font-semibold text-base">
                          {Number(
                            product.finalPrice || product.price
                          ).toLocaleString()}
                          ₫
                        </span>
                      </div>

                      {product.stock !== undefined && (
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          In stock: {product.stock}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-center items-center gap-1 mt-2 text-xs text-gray-600">
                      <Star
                        size={14}
                        className="text-yellow-500"
                        fill="currentColor"
                      />
                      <span>{Math.floor(Math.random() * 200 + 20)} sold</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default WishlistPage;
