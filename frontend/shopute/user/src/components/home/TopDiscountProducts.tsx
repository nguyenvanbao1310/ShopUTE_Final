import { useEffect, useState } from "react";
import axios from "axios";
import ProductDiscountCard from "../ProductDiscountCard";

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
  finalPrice: string; // giá sau giảm
  discountPercent: string; // phần trăm giảm
  status: string;
  stock: number;
  sold: string;
  thumbnailUrl: string; // ảnh chính
  categoryId: number;
  Category: Category;
  Images: Image[];
}

export default function TopDiscountProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8088/api/products/top-discount"
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch top discount products", err);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        🔥 Khuyến mãi cao nhất
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductDiscountCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
