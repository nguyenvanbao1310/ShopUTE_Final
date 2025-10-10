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

interface Props {
  productId: number;
  categoryId: number;
}

const SimilarProducts: FC<Props> = ({ productId, categoryId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8088/api/products/${productId}/similar?categoryId=${categoryId}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching similar products:", err))
      .finally(() => setLoading(false));
  }, [productId, categoryId]);

  if (loading) return <p className="text-center py-6">Loading...</p>;

  return (
    <section className="px-8 py-12">
      <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`}>
            <ProductCard {...product} />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SimilarProducts;
