import { FC, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import Layout from "../../layouts/MainLayout";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { addToCart } from "../../store/cartSlice";

import {
  fetchAllProducts,
  fetchProductsByCategory,
  fetchProductsByCategories,
  fetchAllBrands ,
} from "../../apis/productApi";
import axios from "axios";

// Kiểu dữ liệu
interface Category {
  id: number;
  name: string;
  parentId?: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  finalPrice: number;
  discountPercent: number;
  stock: number;
  thumbnailUrl: string;
  averageRating: number;
  brand: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNext: boolean;
  hasPrev: boolean;
}


const CategoryPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
const handleAddToCart = (productId: number) => {
  dispatch(addToCart({ productId, quantity: 1 }));
};
const [brands, setBrands] = useState<string[]>([]);

  const { categoryName = "" } = useParams<{ categoryName: string }>();

  // State chính
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryName ? [categoryName] : []
  );
  const [showAll, setShowAll] = useState(false);
  const [sortOption, setSortOption] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNext: false,
    hasPrev: false,
  });

  // =============== Fetch API ===============
  const loadProducts = async (page = 1) => {
    try {
      setLoading(true);
      let data;

      if (showAll) {
        data = await fetchAllProducts(page, 12, selectedBrands);
      } else if (selectedCategories.length > 1) {
        data = await fetchProductsByCategories(selectedCategories, page, 12, selectedBrands);
      } else if (selectedCategories.length === 1) {
        data = await fetchProductsByCategory(selectedCategories[0], page, 12, selectedBrands);
      } else {
        data = await fetchAllProducts(page, 12, selectedBrands);
      }

      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      console.error("❌ Lỗi tải sản phẩm:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh mục khi vào trang
  useEffect(() => {
    axios
      .get("http://localhost:8088/api/categories/all")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("❌ Lỗi lấy danh mục:", err));
  }, []);

  // Khi category hoặc brand thay đổi → tải lại sản phẩm
  useEffect(() => {
    loadProducts(1);
  }, [selectedCategories, selectedBrands, showAll]);
  useEffect(() => {
  const fetchBrands = async () => {
    try {
      const data = await fetchAllBrands();
      setBrands(data);
    } catch (err) {
      console.error("❌ Lỗi lấy thương hiệu:", err);
    }
  };

  fetchBrands();
}, []);


  // =============== Handler ===============
  const handleCategoryChange = (catName: string) => {
    let updated = [...selectedCategories];
    if (updated.includes(catName)) {
      updated = updated.filter((c) => c !== catName);
    } else {
      updated.push(catName);
    }
    setSelectedCategories(updated);
  };

  const handleBrandChange = (brand: string) => {
    let updated = [...selectedBrands];
    if (updated.includes(brand)) {
      updated = updated.filter((b) => b !== brand);
    } else {
      updated.push(brand);
    }
    setSelectedBrands(updated);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadProducts(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleShowAllChange = () => {
    setShowAll(!showAll);
  };

  // =============== Sorting ===============
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    if (sortOption === "name-desc") return b.name.localeCompare(a.name);
    if (sortOption === "price-asc") return a.finalPrice - b.finalPrice;
    if (sortOption === "price-desc") return b.finalPrice - a.finalPrice;
    return 0;
  });

  // =============== UI Render ===============
  const displayTitle =
    showAll || selectedCategories.length === 0
      ? "Tất cả sản phẩm"
      : selectedCategories.join(", ");
  const productCount = pagination.totalProducts || 0;

  if (loading && products.length === 0)
    return <p className="text-center py-6">Đang tải sản phẩm...</p>;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="bg-sky-100 text-gray-800 shadow-lg rounded-lg p-6 mb-6 text-center">
          <nav className="flex justify-center items-center mb-4 text-sm">
            <Link
              to="/"
              className="hover:text-blue-500 font-semibold flex items-center transition-colors"
            >
              🏠 Trang chủ
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="font-medium">{displayTitle}</span>
          </nav>

          <h1 className="text-4xl font-extrabold mb-2">
            {displayTitle}
            {products.length > 0 && (
              <span className="text-xl font-normal text-gray-700 ml-2">
                ({productCount} sản phẩm)
              </span>
            )}
          </h1>

          <div className="flex justify-center items-center gap-6 mt-4">
            <div className="flex items-center">
              <span className="mr-3 text-gray-600 font-medium">Sắp xếp theo:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-400"
              >
                <option value="default">Mặc định</option>
                <option value="name-asc">Tên (A - Z)</option>
                <option value="name-desc">Tên (Z - A)</option>
                <option value="price-asc">Giá (Thấp → Cao)</option>
                <option value="price-desc">Giá (Cao → Thấp)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${
                  viewMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${
                  viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Nội dung */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="col-span-1 bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-4">Danh mục</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => handleCategoryChange(cat.name)}
                    />
                    {cat.name}
                  </label>
                </li>
              ))}
              <li>
                <label className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={showAll}
                    onChange={handleShowAllChange}
                  />
                  Hiển thị tất cả
                </label>
              </li>
            </ul>

            <h3 className="font-bold mt-6 mb-4">Thương hiệu</h3>
            <ul className="space-y-2">
  {brands.map((brand) => (
    <li key={brand}>
      <label className="flex items-center">
        <input
          type="checkbox"
          className="mr-2"
          checked={selectedBrands.includes(brand)}
          onChange={() => handleBrandChange(brand)}
        />
        {brand}
      </label>
    </li>
  ))}
</ul>

          </aside>

          {/* Sản phẩm */}
          <main className="col-span-3">
            {sortedProducts.length === 0 && !loading ? (
              <p className="text-center py-10 text-gray-500">
                Không tìm thấy sản phẩm phù hợp.
              </p>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-6"
                  }
                >
                  {sortedProducts.map((product) => (
                    <div
                      key={product.id}
                      className={
                        viewMode === "grid"
                          ? "bg-white border rounded-lg shadow hover:shadow-lg transition"
                          : "flex bg-white border rounded-lg shadow hover:shadow-lg transition"
                      }
                    >
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={product.thumbnailUrl}
                          alt={product.name}
                          className="w-full h-48 object-contain"
                        />
                      </Link>

                      <div className={viewMode === "list" ? "ml-4 flex-1 p-2" : "p-4"}>
                        <Link to={`/product/${product.id}`}>
                          <h3 className="font-semibold">{product.name}</h3>
                        </Link>
                        <div className="flex items-center mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < Math.floor(product.averageRating)
                                  ? "text-yellow-500 fill-current"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            ({product.averageRating.toFixed(1)})
                          </span>
                        </div>
                        <div className="mt-2">
                          {product.discountPercent > 0 && (
                            <span className="text-gray-400 line-through mr-2">
                              {Number(product.price).toLocaleString()} ₫
                            </span>
                          )}
                          <span className="text-red-600 font-bold">
                            {Number(product.finalPrice).toLocaleString()} ₫
                          </span>
                        </div>
                        <button
  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
  onClick={() => handleAddToCart(product.id)}
>
  🛒 Thêm vào giỏ
</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Phân trang */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrev}
                        className={`px-3 py-2 border rounded ${
                          pagination.hasPrev
                            ? "hover:bg-gray-100"
                            : "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <ChevronLeft size={16} /> Trước
                      </button>

                      {Array.from(
                        { length: pagination.totalPages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 border rounded ${
                            pagination.currentPage === page
                              ? "bg-blue-600 text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNext}
                        className={`px-3 py-2 border rounded ${
                          pagination.hasNext
                            ? "hover:bg-gray-100"
                            : "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        Tiếp <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
