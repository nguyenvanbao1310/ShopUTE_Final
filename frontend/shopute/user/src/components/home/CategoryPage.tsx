import { FC, useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import Layout from "../../layouts/MainLayout";

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
  Category: Category;
  Images: { url: string; position: number }[];
  brand: string; // Thêm trường brand để hiển thị hoặc lọc
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ApiResponse {
  products: Product[];
  pagination: PaginationInfo;
}

const CategoryPage: FC = () => {
  const { categoryName = "" } = useParams<{ categoryName: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]); // Thay selectedBatteries bằng selectedBrands
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryName);
  const [showAllDimensions, setShowAllDimensions] = useState(false); // Đổi default thành false
  const [currentView, setCurrentView] = useState<string>(categoryName || ""); // Theo dõi chế độ hiện tại

  // Hàm lấy dữ liệu sản phẩm theo danh mục với lọc brand
  const fetchProductsByCategory = async (page: number = 1, catName: string = selectedCategory) => {
    try {
      setLoading(true);
      console.log("Selected Brands before API call:", selectedBrands); // Log để kiểm tra selectedBrands
      const brandsQuery = selectedBrands.length > 0 ? `&brand=${selectedBrands.join(",")}` : "";
      console.log("API URL:", `http://localhost:8088/api/products/category/${catName}?page=${page}&limit=12${brandsQuery}`); // Log URL
      const response = await axios.get<ApiResponse>(
        `http://localhost:8088/api/products/category/${catName}?page=${page}&limit=12${brandsQuery}`
      );
      console.log("API Response (Category):", response.data);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Lỗi lấy sản phẩm theo danh mục:", err);
      setProducts([]);
      setPagination({ currentPage: 1, totalPages: 1, totalProducts: 0, hasNext: false, hasPrev: false });
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy tất cả sản phẩm với lọc brand
  const fetchAllProducts = async (page: number = 1) => {
    try {
      setLoading(true);
      const brandsQuery = selectedBrands.length > 0 ? `&brand=${selectedBrands.join(',')}` : '';
      const response = await axios.get<ApiResponse>(
        `http://localhost:8088/api/products/all?page=${page}&limit=12${brandsQuery}`
      );
      console.log("API Response (All):", response.data);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
      setCurrentView("all");
    } catch (err) {
      console.error("Lỗi lấy tất cả sản phẩm:", err);
      setProducts([]);
      setPagination({ currentPage: 1, totalPages: 1, totalProducts: 0, hasNext: false, hasPrev: false });
    } finally {
      setLoading(false);
    }
  };

  // Khởi tạo dữ liệu
  useEffect(() => {
    console.log("useEffect triggered with categoryName:", categoryName, "selectedBrands:", selectedBrands); // Log để kiểm tra
    setSelectedCategory(categoryName);
    setShowAllDimensions(categoryName.toLowerCase() === "all");
    if (categoryName.toLowerCase() === "all" || showAllDimensions) {
      fetchAllProducts(1);
    } else {
      fetchProductsByCategory(1, categoryName);
    }
    axios
      .get("http://localhost:8088/api/categories/all")
      .then((res) => {
        console.log("Categories fetched:", res.data); // Log danh mục
        setCategories(res.data);
      })
      .catch((err) => console.error("Lỗi lấy categories:", err));
  }, [categoryName, selectedBrands]);

  // Xử lý chuyển trang
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      if (currentView === "all") {
        fetchAllProducts(newPage);
      } else {
        fetchProductsByCategory(newPage);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Xử lý thay đổi danh mục
  const handleCategoryChange = (selectedCategory: string) => {
    if (selectedCategory.toLowerCase() !== categoryName) {
      navigate(`/category/${selectedCategory.toLowerCase()}`);
      fetchProductsByCategory(1, selectedCategory.toLowerCase());
    }
  };

  // Xử lý bộ lọc brand
  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // Xử lý checkbox "Hiển thị tất cả"
  const handleShowAllChange = () => {
    setShowAllDimensions(!showAllDimensions);
    if (!showAllDimensions) {
      fetchAllProducts(1); // Hiển thị tất cả khi checked
    } else {
      fetchProductsByCategory(1, categoryName); // Quay về danh mục hiện tại khi unchecked
    }
  };

  // Sắp xếp sản phẩm
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    if (sortOption === "name-desc") return b.name.localeCompare(a.name);
    if (sortOption === "price-asc") return a.finalPrice - b.finalPrice;
    if (sortOption === "price-desc") return b.finalPrice - a.finalPrice;
    return 0;
  });

  // Title động cho h1 với số lượng chính xác
  const displayTitle = currentView === "all" ? "Tất cả sản phẩm" : (categoryName?.charAt(0).toUpperCase() + categoryName?.slice(1));
  const productCount = products.length > 0 ? pagination.totalProducts : 0;

  if (loading && products.length === 0) return <p className="text-center py-6">Đang tải...</p>;

  return (
    <Layout>
    <div className="container mx-auto p-6">
      {/* Header nâng cấp giao diện, căn giữa và màu xanh đậm */}
      <div className="bg-sky-100 text-gray-800 shadow-lg rounded-lg p-6 mb-6 text-center">
        {/* Breadcrumb nâng cấp, căn giữa */}
        <nav className="flex justify-center items-center mb-4 text-sm">
          <Link to="/" className="hover:text-blue-200 font-semibold flex items-center transition-colors">
            <span className="mr-1">🏠</span> Trang chủ
          </Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-black-100 font-medium">{displayTitle}</span>
        </nav>

        {/* Tiêu đề và số lượng sản phẩm, căn giữa */}
        <div className="mb-4">
          <h1 className="text-4xl font-extrabold mb-2">
            {displayTitle}
            {products.length === 0 ? "" : (
              <span className="text-xl font-normal text-black-200 ml-2">
                ({productCount} sản phẩm)
              </span>
            )}
          </h1>
        </div>

        {/* Thanh điều khiển sắp xếp và chế độ xem, căn giữa */}
        <div className="flex justify-center items-center gap-6">
          <div className="flex items-center">
            <span className="mr-4 text-black-200 font-medium">Sắp xếp theo:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="default">Mặc định</option>
              <option value="name-asc">Tên (A - Z)</option>
              <option value="name-desc">Tên (Z - A)</option>
              <option value="price-asc">Giá (Thấp &gt; Cao)</option>
              <option value="price-desc">Giá (Cao &gt; Thấp)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-700 text-white"} hover:bg-gray-600 transition-colors`}
              aria-label="Chế độ lưới"
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-700 text-white"} hover:bg-gray-600 transition-colors`}
              aria-label="Chế độ danh sách"
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
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
                    checked={cat.name.toLowerCase() === categoryName}
                    onChange={() => handleCategoryChange(cat.name)}
                  />
                  {cat.name}
                </label>
              </li>
            ))}
            <li>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={showAllDimensions}
                  onChange={handleShowAllChange}
                />
                Hiển thị tất cả
              </label>
            </li>
          </ul>

          <h3 className="font-bold mt-6 mb-4">Brand</h3> 
  <ul className="space-y-2">
    {["Sony", "MSI", "Logitech", "LG", "Lenovo", "Keychron", "HP", "Dell", "Asus", "Apple"].map((brand) => (
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

        <main className="col-span-3">
          <div className="bg-gray-100 p-4 rounded mb-6">
            <p className="text-gray-700">
              Mô tả {displayTitle.toLowerCase()}.
            </p>
          </div>

          {sortedProducts.length === 0 && !loading ? (
            <p className="text-center py-10 text-gray-500">Không tìm thấy sản phẩm trong danh mục này.</p>
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
                        ? "bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        : "flex bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    }
                  >
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.thumbnailUrl}
                        alt={product.name}
                        className="w-full h-48 object-contain mb-2"
                      />
                    </Link>
                   
<Link to={`/product/${product.id}`}>
 
</Link>
                    <div className={viewMode === "list" ? "ml-4 flex-1" : ""}>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-semibold">{product.name}</h3>
                      </Link>
                      <div className="flex items-center">
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
                        <span className="ml-2">
                          ({product.averageRating.toFixed(1)})
                        </span>
                      </div>
                      <div className="mt-2">
                        {product.discountPercent > 0 && product.price != null && (
                          <span className="text-gray-400 line-through mr-2">
                            {Number(product.price).toLocaleString()} VNĐ
                          </span>
                        )}
                        <span className="text-red-600 font-bold">
                          {product.finalPrice != null
                            ? Number(product.finalPrice).toLocaleString()
                            : Number(product.price ?? 0).toLocaleString()} VNĐ
                        </span>
                      </div>
                      <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Điều khiển phân trang */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className={`px-3 py-2 border rounded flex items-center ${
                        pagination.hasPrev ? "hover:bg-gray-100" : "opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <ChevronLeft size={16} className="mr-1" /> Trước
                    </button>

                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 border rounded ${
                          pagination.currentPage === page ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className={`px-3 py-2 border rounded flex items-center ${
                        pagination.hasNext ? "hover:bg-gray-100" : "opacity-50 cursor-not-allowed"
                      }`}
                    >
                      Tiếp <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {loading && products.length > 0 && (
            <div className="text-center py-4">
              <p>Đang tải sản phẩm...</p>
            </div>
          )}
        </main>
      </div>
    </div>
    </Layout>
  );
};

export default CategoryPage;