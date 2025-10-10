import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import { viewedApi } from "../../apis/viewedApi";

interface Product {
  id: number;
  name: string;
  brand?: string;
  price: string;
  stock?: number;
  thumbnailUrl: string;
  description?: string;
}

interface ViewedProductItem {
  id: number;
  userId: number;
  productId: number;
  Product: Product;
}

const ViewedProductsPage: FC = () => {
  const [viewedProducts, setViewedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );

  const token = localStorage.getItem("token");

  const fetchViewedProducts = async () => {
    try {
      const res = await viewedApi.getViewedProducts();
      const data = res.data;
      const products = data.items.map(
        (item: ViewedProductItem) => item.Product
      );
      setViewedProducts(products);
    } catch (err) {
      console.error("Error fetching viewed products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: number) => {
    try {
      await viewedApi.removeViewedProduct(productId);
      setViewedProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Error removing viewed product:", err);
    }
  };

  useEffect(() => {
    fetchViewedProducts();
  }, []);

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Recently Viewed
          </h1>

          {loading ? (
            <p className="text-center text-gray-500 mt-10">
              Loading recently viewed products...
            </p>
          ) : viewedProducts.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              You haven't viewed any products yet.
            </p>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {viewedProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative min-w-[220px] bg-white border rounded-2xl shadow p-4 flex flex-col items-center
                             transition-transform duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg"
                >
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(product.id)}
                    title="Remove from viewed"
                    className="absolute top-2 right-2 z-10"
                  >
                    <X size={20} className="text-gray-400 hover:text-red-500" />
                  </button>

                  {/* Product Image */}
                  <img
                    src={product.thumbnailUrl}
                    alt={product.name}
                    className="w-full h-36 object-contain rounded-lg cursor-pointer
                               transition-transform duration-300 hover:scale-105"
                    onClick={() => setQuickViewProduct(product)}
                  />

                  {/* Product Info */}
                  <div className="mt-3 text-center flex-1 flex flex-col justify-between w-full">
                    {product.brand && (
                      <p className="text-xs text-gray-400 mb-1">
                        {product.brand}
                      </p>
                    )}
                    <h3
                      className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-pink-600 transition-colors cursor-pointer"
                      onClick={() => setQuickViewProduct(product)}
                    >
                      {product.name}
                    </h3>
                    <div className="mt-1 text-pink-600 font-bold text-base">
                      {Number(product.price).toLocaleString()}₫
                    </div>
                    {product.stock !== undefined && (
                      <p className="text-xs text-gray-500 mt-1">
                        In stock: {product.stock}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick View Modal */}
        {quickViewProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-96 relative">
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              >
                <X size={20} />
              </button>
              <img
                src={quickViewProduct.thumbnailUrl}
                alt={quickViewProduct.name}
                className="w-full h-48 object-contain rounded-lg mb-4"
              />
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                {quickViewProduct.name}
              </h2>
              {quickViewProduct.brand && (
                <p className="text-sm text-gray-400 mb-2">
                  {quickViewProduct.brand}
                </p>
              )}
              <p className="text-pink-600 font-bold text-lg mb-2">
                {Number(quickViewProduct.price).toLocaleString()}₫
              </p>
              {quickViewProduct.stock !== undefined && (
                <p className="text-sm text-gray-500 mb-2">
                  In stock: {quickViewProduct.stock}
                </p>
              )}
              {quickViewProduct.description && (
                <p className="text-sm text-gray-600">
                  {quickViewProduct.description}
                </p>
              )}
              <Link
                to={`/product/${quickViewProduct.id}`}
                className="mt-4 inline-block w-full text-center bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
                onClick={() => setQuickViewProduct(null)}
              >
                View Product
              </Link>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ViewedProductsPage;
