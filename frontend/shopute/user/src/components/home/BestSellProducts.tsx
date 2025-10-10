import { FC, useEffect, useState } from "react";
import axios from "axios";
import BestSellProductCard from "../BestSellProductCard";

interface Category {
  id: number;
  name: string;
  parentId?: number;
}

interface Image {
  id: number;
  url: string;
  position: number;
}

interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  finalPrice: string;
  discountPercent: string;
  status: string;
  stock: number;
  sold: string;
  thumbnailUrl: string;
  categoryId: number;
  Category: Category;
  Images: Image[];
}

const BestSellProducts: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Product[]>("http://localhost:8088/api/products/best-sellers") // 🔥 đổi URL theo backend của bạn
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      {/* Banner bên trái */}
      <div className="relative col-span-1 md:col-span-1">
        <img
          src="/img/banner-new.jpg"
          alt="New products"
          className="w-full h-full object-cover rounded-2xl"
        />
        <div className="absolute top-4 left-4 bg-white bg-opacity-80 px-3 py-2 rounded-lg">
          <h2 className="text-xl font-bold">Top Selling</h2>
          <a href="#" className="text-pink-500 text-sm hover:underline">
            View All
          </a>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {products.map((p) => (
          <BestSellProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};

export default BestSellProducts;
