import { FC, useEffect, useState } from "react";
import axios from "axios";
import ProductMostViewCard from "../ProductMostViewCard";

interface Product {
  id: number;
  name: string;
  price: string;
  finalPrice: string;
  discountPercent: string;
  thumbnailUrl: string;
}

const MostViewedProducts: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8088/api/products/most-viewed")
      .then((res) => setProducts(res.data))
      .catch((err) =>
        console.error("Error fetching most viewed products:", err)
      );
  }, []);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      {/* Danh sách sản phẩm bên trái */}
      <div className="col-span-2">
        <h2 className="text-lg font-bold mb-4">Most view</h2>

        {/* 2 cột */}
        <div className="grid grid-cols-2 gap-4">
          {products.map((p) => (
            <ProductMostViewCard key={p.id} product={p} />
          ))}
        </div>

        {/* Link xem tất cả */}
        <div className="mt-4">
          <a href="/specials" className="text-pink-600 text-sm hover:underline">
            All Products &gt;
          </a>
        </div>
      </div>

      {/* Banner bên phải */}
      <div className="col-span-1 flex items-center justify-center">
        <img
          src="/img/most_view.jpg"
          alt="Most view"
          className="w-[500px] h-[300px] object-cover rounded-xl"
        />
      </div>
    </section>
  );
};

export default MostViewedProducts;
