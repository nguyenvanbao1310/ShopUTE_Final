import { FC, useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import {
  Star,
  Heart,
  Share,
  ShoppingCart,
  Truck,
  CreditCard,
  Twitter,
  Facebook,
  Instagram,
  MoreVertical,
} from "lucide-react";
import SimilarProducts from "./SimilarProducts";
import MainLayout from "../../layouts/MainLayout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { addToCart } from "../../store/cartSlice";
import {
  createProductRating,
  fetchProductRatings,
  updateRating,
} from "../../apis/rating";
import { viewedApi } from "../../apis/viewedApi";
import RatingSection from "./RatingSection";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  thumbnailUrl: string;
  categoryId: number;
  Category: { name: string };
  Images: { url: string; position: number }[];
  cpu: string;
  ram: string;
  storage: string;
  gpu: string;
  screen: string;
  discountPercent?: number;
  finalPrice?: number;
  buyerCount?: number;
  commentCount?: number;
  status: "ACTIVE" | "INACTIVE";
}

interface Rating {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: { name: string };
}

const ProductDetail: FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [myRating, setMyRating] = useState<number>(0);
  const [myComment, setMyComment] = useState<string>("");
  const [rewardType, setRewardType] = useState<"points" | "coupon">("points");
  const [submitMsg, setSubmitMsg] = useState<string>("");
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [editing, setEditing] = useState<{
    id: number;
    rating: number;
    comment: string;
  } | null>(null);

  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((s: any) => s?.auth?.isAuthenticated);
  const currentUserId = useSelector((s: any) => s?.auth?.user?.id);
  const viewedAdded = useRef(false);
  const IMAGE_BASE_URL = process.env.REACT_APP_API_IMAGE_URL;

  useEffect(() => {
    axios
      .get(`http://localhost:8088/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));

    fetchProductRatings(Number(id))
      .then((data) => setRatings(data || []))
      .catch(() => setRatings([]))
      .finally(() => setRatingsLoading(false));

    if (!viewedAdded.current) {
      viewedApi
        .addViewedProduct(Number(id))
        .then(() => console.log("Added to viewed products"))
        .catch((err) => console.error("Failed to add viewed product", err));

      viewedAdded.current = true;
    }
  }, [id]);

  const toggleFavorite = () => setIsFavorite(!isFavorite);
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "https://placehold.co/500x500?text=Image+Not+Found";
  };
  const handleQuantityChange = (change: number) => {
    setQuantity((prev) =>
      Math.max(1, Math.min(prev + change, product?.stock || 1))
    );
  };

  const refreshRatings = async () => {
    if (!id) return;
    const data = await fetchProductRatings(Number(id));
    setRatings(data || []);
  };

  const submitReview = async () => {
    setSubmitMsg("");
    try {
      if (!id) return;
      const res = await createProductRating(Number(id), {
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
        setSubmitMsg(
          `Cảm ơn bạn! Bạn đã nhận ${(res as any).reward.points} điểm tích lũy.`
        );
      } else {
        setSubmitMsg("Cảm ơn bạn đã đánh giá!");
      }
      setMyRating(0);
      setMyComment("");
    } catch (e: any) {
      const msg =
        e?.response?.data?.message || e?.message || "Gửi đánh giá thất bại";
      setSubmitMsg(msg);
    }
  };

  const onClickEdit = (r: Rating) => {
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
      // no-op
    }
  };

  // Revoking ratings is no longer supported

  if (loading) return <p className="text-center py-6">Đang tải...</p>;
  if (!product)
    return <p className="text-center py-6">Không tìm thấy sản phẩm</p>;

  const finalPrice =
    product.finalPrice ||
    (product.discountPercent
      ? product.price * (1 - product.discountPercent / 100)
      : product.price);
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;
  const colors = ["Black", "Silver", "Gold"];

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-gray-800 py-8 text-center">
          <div className="container mx-auto px-6">
            <nav className="text-sm text-gray-300 mb-2">
              <Link to="/" className="hover:underline">
                Home
              </Link>{" "}
              &gt;{" "}
              <Link
                to={`/category/${product.Category.name.toLowerCase()}`}
                className="hover:underline"
              >
                {product.Category.name}
              </Link>{" "}
              &gt;{" "}
              <span className="text-white font-semibold">{product.name}</span>
            </nav>
            <h1 className="text-3xl font-bold text-white">{product.name}</h1>
          </div>
        </div>

        <div className="-mt-6 relative z-10">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              <div className="relative">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  className="w-full h-[500px] rounded-lg overflow-hidden"
                >
                  {product.Images.length > 0 ? (
                    product.Images.map((image) => (
                      <SwiperSlide key={image.position}>
                        <img
                          src={image.url}
                          alt={product.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = `${IMAGE_BASE_URL}/${product.thumbnailUrl}`;
                          }}
                        />
                      </SwiperSlide>
                    ))
                  ) : (
                    <SwiperSlide>
                      <img
                        src={product.thumbnailUrl}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        onError={handleImageError}
                      />
                    </SwiperSlide>
                  )}
                </Swiper>
                <div className="flex justify-center space-x-2 mt-4">
                  {product.Images.length > 0 ? (
                    product.Images.map((image) => (
                      <img
                        key={image.position}
                        src={image.url}
                        alt={product.name}
                        className="w-16 h-16 object-cover cursor-pointer border rounded hover:border-blue-500"
                        onError={(e) => {
                          e.currentTarget.src = `${IMAGE_BASE_URL}/${product.thumbnailUrl}`;
                        }}
                      />
                    ))
                  ) : (
                    <img
                      src={product.thumbnailUrl}
                      alt={product.name}
                      className="w-16 h-16 object-cover cursor-pointer border rounded hover:border-blue-500"
                      onError={handleImageError}
                    />
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.round(averageRating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }
                    />
                  ))}
                  <span className="ml-2 text-gray-600">
                    ({ratings.length} Reviews)
                  </span>
                </div>

                <div className="space-x-4">
                  {product.discountPercent && product.discountPercent > 0 ? (
                    <span className="text-gray-400 line-through text-lg">
                      {product.price.toLocaleString()} VNĐ
                    </span>
                  ) : null}
                  <span className="text-blue-600 font-bold text-3xl">
                    {finalPrice.toLocaleString()} VNĐ
                  </span>
                  {product.discountPercent && product.discountPercent > 0 ? (
                    <span className="text-red-500 text-lg">
                      (-{product.discountPercent}%)
                    </span>
                  ) : null}
                </div>

                <div>
                  <p className="text-gray-600">{product.description}</p>
                </div>

                <div className="space-y-4 border-t border-b py-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <div className="flex space-x-3">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-10 h-10 rounded-full border-2 ${
                            selectedColor === color
                              ? "border-blue-500"
                              : "border-gray-300"
                          }`}
                          style={{
                            backgroundColor:
                              color.toLowerCase() === "black"
                                ? "#000"
                                : color.toLowerCase() === "silver"
                                ? "#c0c0c0"
                                : color.toLowerCase() === "gold"
                                ? "#ffd700"
                                : "#fff",
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.max(
                              1,
                              Math.min(Number(e.target.value), product.stock)
                            )
                          )
                        }
                        className="w-16 text-center border border-gray-300 rounded-lg p-2"
                        min="1"
                        max={product.stock}
                      />
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                        disabled={quantity >= product.stock}
                      >
                        +
                      </button>
                      <span className="text-gray-500 text-sm">
                        ({product.stock} available)
                      </span>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-4 text-lg">Statistics</h3>
                    <div className="space-y-3 text-gray-700">
                      <div>
                        <span className="font-medium">Customers bought:</span>{" "}
                        {product.buyerCount || 0}
                      </div>
                      <div>
                        <span className="font-medium">Comments:</span>{" "}
                        {product.commentCount || 0}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      className={`flex-1 px-6 py-3 rounded-lg flex items-center justify-center ${
                        product.status === "INACTIVE"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                      onClick={() => {
                        if (product.status === "INACTIVE") {
                          alert("Sản phẩm hiện đã ngừng bán!");
                          return;
                        }
                        dispatch(
                          addToCart({ productId: product.id, quantity })
                        );
                      }}
                      disabled={product.status === "INACTIVE"}
                    >
                      <ShoppingCart size={20} className="mr-2" />
                      <span>
                        {product.status === "INACTIVE"
                          ? "Ngừng bán"
                          : "Add to Cart"}
                      </span>
                    </button>

                    <button
                      onClick={toggleFavorite}
                      className={`p-3 border border-gray-300 rounded-lg flex items-center justify-center ${
                        isFavorite
                          ? "text-red-500 bg-red-50 border-red-200"
                          : "text-gray-600 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        size={20}
                        className={isFavorite ? "fill-current" : ""}
                      />
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold mb-4 text-lg">Information</h3>
                  <div className="space-y-3 text-gray-700">
                    <div>
                      <span className="font-medium">CPU:</span>{" "}
                      {product.cpu || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">RAM:</span>{" "}
                      {product.ram || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Storage:</span>{" "}
                      {product.storage || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">GPU:</span>{" "}
                      {product.gpu || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Screen:</span>{" "}
                      {product.screen || "N/A"}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center">
                      <Share size={20} className="mr-2" />
                      Share:
                    </h3>
                    <div className="flex space-x-4">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <Twitter size={24} />
                      </button>
                      <button className="text-pink-600 hover:text-pink-800 transition-colors">
                        <Instagram size={24} />
                      </button>
                      <button className="text-blue-800 hover:text-blue-900 transition-colors">
                        <Facebook size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* New Rating Section Component (extracted) */}
          <div className="mt-6">
            <RatingSection productId={product.id} />
          </div>
          {/* Similar Products */}
          <SimilarProducts
            productId={product.id}
            categoryId={product.categoryId}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
