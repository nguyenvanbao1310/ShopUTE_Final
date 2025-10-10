import { FC, useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../ProductCard";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: number;
  thumbnailUrl?: string;
}

const FeaturedProducts: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8088/api/products/newest")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching featured products:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-6">Loading...</p>;

  return (
    <section className="px-8 py-12">
      <h2 className="text-2xl font-bold mb-6">New-Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`}>
            <ProductCard {...product} />
          </Link>
        ))}
      </div>
      <div className="text-center mt-6">
        <button className="px-6 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 transition">
          All Product →
        </button>
      </div>
    </section>
  );
};

export default FeaturedProducts;
