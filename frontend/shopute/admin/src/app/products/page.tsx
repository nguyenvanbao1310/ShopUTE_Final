"use client";

import { useEffect, useState } from "react";
import { productApi, Product } from "@/lib/productApi";
import { AdminButton } from "@/components/ui/AdminButton";
import { Card, CardContent } from "@/components/ui/Card";
import { Eye, Pencil, Trash2, ChevronDown } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import AddProductModal from "../../components/modals/AddProductModal";
import EditProductModal from "../../components/modals/EditProductModal";
import { uploadImage } from "../../lib/uploadImage";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("Newest");
  const [openModal, setOpenModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");

  const limit = 7; // ✅ mỗi trang 7 sản phẩm
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_IMAGE_URL;

  // 🧩 Load danh sách sản phẩm
  useEffect(() => {
    fetchProducts();
  }, [page, sortBy, search]);

  const fetchProducts = async () => {
    try {
      const res = await productApi.getAll(page, limit, search, sortBy);
      setProducts(res.data);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("❌ Failed to fetch products:", error);
    }
  };

  // ➕ Thêm sản phẩm mới
  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()) as any;

    const file = formData.get("thumbnail") as File | null;
    let thumbnailUrl = "";
    if (file && file.size > 0) {
      try {
        thumbnailUrl = await uploadImage(file);
      } catch (error) {
        console.error("❌ Lỗi upload ảnh:", error);
        alert("Upload ảnh thất bại!");
        return;
      }
    }

    const imageFiles = formData.getAll("images") as File[];
    let imageUrls: string[] = [];

    if (imageFiles.length > 0) {
      try {
        imageUrls = await Promise.all(
          imageFiles.map((file) => uploadImage(file))
        );
      } catch (error) {
        console.error("❌ Lỗi upload ảnh phụ:", error);
        alert("Upload ảnh phụ thất bại!");
        return;
      }
    }

    const newProduct = {
      name: data.name,
      description: data.description || "",
      price: Number(data.price),
      stock: Number(data.stock),
      categoryId: Number(data.categoryId),
      brand: data.brand,
      cpu: data.cpu,
      ram: data.ram,
      storage: data.storage,
      gpu: data.gpu,
      screen: data.screen,
      viewCount: 0,
      status: (data.status === "ACTIVE" ? "ACTIVE" : "INACTIVE") as
        | "ACTIVE"
        | "INACTIVE",
      thumbnailUrl,
      imageUrls,
    };

    try {
      await productApi.create(newProduct);
      alert("✅ Thêm sản phẩm thành công!");
      setOpenModal(false);
      await fetchProducts();
    } catch (err) {
      console.error("❌ Lỗi khi thêm sản phẩm:", err);
      alert("❌ Lỗi khi thêm sản phẩm, kiểm tra console!");
    }
  };

  // ✏️ Mở modal Edit và load sản phẩm theo ID
  const handleEditClick = async (id: number) => {
    try {
      const product = await productApi.getById(id);
      setSelectedProduct(product);
      setOpenEdit(true);
    } catch (err) {
      console.error("❌ Lỗi khi lấy thông tin sản phẩm:", err);
      alert("Không thể lấy thông tin sản phẩm.");
    }
  };

  // 💾 Lưu chỉnh sửa
  const handleEditSubmit = async (id: number, formData: FormData) => {
    try {
      const updatedProduct: any = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: Number(formData.get("price")),
        stock: Number(formData.get("stock")),
        categoryId: Number(formData.get("categoryId")),
        brand: formData.get("brand") as string,
        cpu: formData.get("cpu") as string,
        ram: formData.get("ram") as string,
        storage: formData.get("storage") as string,
        gpu: formData.get("gpu") as string,
        screen: formData.get("screen") as string,
        status:
          (formData.get("status") as string) === "ACTIVE"
            ? "ACTIVE"
            : "INACTIVE",
        imageUrls: [] as string[],
      };

      // 🟢 Nếu có upload thumbnail mới thì mới thêm thumbnailUrl
      const thumbnailFile = formData.get("thumbnail") as File;
      if (thumbnailFile && thumbnailFile.size > 0) {
        const uploadedUrl = await uploadImage(thumbnailFile);
        updatedProduct.thumbnailUrl = uploadedUrl;
      }

      // 🟢 Nếu có upload thêm ảnh phụ thì thêm imageUrls
      const images = formData.getAll("images") as File[];
      if (images.length > 0) {
        const uploadedUrls = await Promise.all(images.map(uploadImage));
        updatedProduct.imageUrls = uploadedUrls;
      }

      await productApi.update(id, updatedProduct);
      alert("✅ Cập nhật sản phẩm thành công!");
      setOpenEdit(false);
      await fetchProducts();
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("Cập nhật thất bại!");
    }
  };

  const handleExportCSV = async () => {
    try {
      await productApi.exportCSV();
    } catch (error) {
      console.error("❌ Xuất CSV thất bại:", error);
      alert("❌ Lỗi khi xuất CSV!");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">Product List</h2>
                <p className="text-sm text-gray-500">
                  Manage your store inventory efficiently
                </p>
              </div>
              <input
                type="text"
                placeholder="Search by name, brand, ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1); // reset về trang đầu
                }}
                className="border border-gray-300 rounded-md py-1.5 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-56"
              />

              <div className="flex gap-3 items-center">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Newest</option>
                    <option>Oldest</option>
                    <option>Price: High to Low</option>
                    <option>Price: Low to High</option>
                    <option>Top Viewed</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>

                <AdminButton
                  type="button"
                  variant="primary"
                  onClick={() => setOpenModal(true)}
                >
                  Add Product
                </AdminButton>
                <AdminButton
                  type="button"
                  variant="secondary"
                  onClick={handleExportCSV}
                >
                  Export as CSV
                </AdminButton>
              </div>
            </div>

            {/* 🧾 Danh sách sản phẩm */}
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left text-gray-600">
                  <th className="p-2">ID</th>
                  <th className="p-2">Product</th>
                  <th className="p-2">Image</th>
                  <th className="p-2">Brand</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Stock</th>
                  <th className="p-2">Views</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Created At</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{p.id}</td>
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">
                      {p.thumbnailUrl ? (
                        <img
                          src={`${API_BASE_URL}/${p.thumbnailUrl}`}
                          alt={p.name}
                          className="w-16 h-16 object-cover rounded-md border"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-md text-gray-400 text-xs">
                          No image
                        </div>
                      )}
                    </td>
                    <td className="p-2">{p.brand}</td>
                    <td className="p-2">
                      {Number(p.price).toLocaleString("vi-VN")} VNĐ
                    </td>
                    <td className="p-2">{p.stock}</td>
                    <td className="p-2">{p.viewCount}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          p.status === "ACTIVE"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-2 text-gray-600">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-7 flex justify-center gap-2">
                      <Eye className="text-green-600 cursor-pointer w-5 h-5" />
                      <Pencil
                        className="text-blue-600 cursor-pointer w-5 h-5"
                        onClick={() => handleEditClick(p.id)}
                      />
                      <Trash2
                        className="text-red-600 cursor-pointer w-5 h-5"
                        onClick={async () => {
                          if (confirm(`Xóa sản phẩm "${p.name}"?`)) {
                            try {
                              await productApi.remove(p.id);
                              alert("🗑 Xóa sản phẩm thành công!");
                              await fetchProducts();
                            } catch (err) {
                              console.error(err);
                              alert("❌ Lỗi khi xóa sản phẩm!");
                            }
                          }
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 🔢 Pagination */}
            <div className="flex justify-center items-center mt-6 gap-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </CardContent>
        </Card>

        {/* ➕ Modal thêm sản phẩm */}
        <AddProductModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSubmit={handleAddProduct}
        />

        {/* ✏️ Modal chỉnh sửa sản phẩm */}
        {selectedProduct && (
          <EditProductModal
            open={openEdit}
            onClose={() => setOpenEdit(false)}
            onSubmit={handleEditSubmit}
            product={selectedProduct}
          />
        )}
      </div>
    </AdminLayout>
  );
}
