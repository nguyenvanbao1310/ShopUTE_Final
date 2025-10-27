"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Product, productApi, ProductImage } from "@/lib/productApi";
import { categoriesApi, Category } from "@/lib/categoriesApi";

export default function EditProductModal({
  open,
  onClose,
  product,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  product: (Product & { images?: { id: number; url: string }[] }) | null;
  onSubmit: (id: number, formData: FormData) => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [imageObjects, setImageObjects] = useState<
    (ProductImage | { url: string; file?: File })[]
  >([]);
  const [thumbnailRemoved, setThumbnailRemoved] = useState(false);

  // 🟢 Load danh mục
  useEffect(() => {
    categoriesApi.getAll().then(setCategories).catch(console.error);
  }, []);

  // 🟢 Khi mở modal, load dữ liệu cũ
  useEffect(() => {
    if (product) {
      const API_URL =
        process.env.NEXT_PUBLIC_API_BASE_IMAGE_URL || "http://localhost:3000";

      setThumbnailPreview(
        product.thumbnailUrl ? `${API_URL}/${product.thumbnailUrl}` : null
      );

      productApi.getImages(product.id).then((imgs) => {
        const formatted = imgs.map((img) => ({
          id: img.id,
          url: `${API_URL}/${img.url}`,
        }));
        setImageObjects(formatted);
      });
    }
  }, [product]);

  // 🟣 Handle upload thumbnail
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setThumbnailPreview(URL.createObjectURL(file));
  };

  // 🟣 Handle upload ảnh phụ
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newObjs = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setImageObjects((prev) => [...prev, ...newObjs]);
  };

  // 🟣 Xoá thumbnail
  const handleRemoveThumbnail = () => {
    setThumbnailPreview(null);
    setThumbnailRemoved(true);
  };

  // 🟣 Xoá ảnh phụ
  const handleRemoveImage = async (index: number) => {
    const target = imageObjects[index];
    if (!target || !product) return;

    try {
      if ("id" in target && target.id) {
        await productApi.deleteImage(target.id);
      }
      setImageObjects((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Lỗi khi xoá ảnh:", err);
    }
  };

  // 🟢 Submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!product) return;

    const form = e.currentTarget;
    const formData = new FormData();

    const thumbnailInput = form.querySelector(
      'input[name="thumbnail"]'
    ) as HTMLInputElement;
    const hasNewThumbnail = thumbnailInput?.files?.[0];
    const hasExistingThumbnail = !thumbnailRemoved && thumbnailPreview !== null;

    if (!hasNewThumbnail && !hasExistingThumbnail) {
      alert("❌ Vui lòng chọn ảnh thumbnail!");
      return;
    }

    if (imageObjects.length === 0) {
      alert("❌ Vui lòng chọn ít nhất 1 ảnh phụ!");
      return;
    }

    // Thêm các trường form
    const fields = [
      "name",
      "brand",
      "description",
      "categoryId",
      "stock",
      "price",
      "status",
      "cpu",
      "ram",
      "storage",
      "gpu",
      "screen",
    ];
    fields.forEach((f) => formData.append(f, form[f].value));

    if (thumbnailRemoved) formData.append("removeThumbnail", "true");
    if (hasNewThumbnail) formData.append("thumbnail", thumbnailInput.files![0]);

    const imagesInput = form.querySelector(
      'input[name="images"]'
    ) as HTMLInputElement;
    if (imagesInput?.files?.length) {
      for (const file of imagesInput.files) formData.append("images", file);
    }

    onSubmit(product.id, formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[96vw] sm:max-w-[96vw] lg:max-w-[1350px] h-[90vh] overflow-y-auto bg-white rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            ✏️ Edit Product
          </DialogTitle>
        </DialogHeader>

        {product && (
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="mt-4 grid grid-cols-3 gap-6"
          >
            {/* LEFT */}
            <div className="col-span-2 flex flex-col gap-6">
              {/* Thông tin cơ bản */}
              <div className="border rounded-xl p-5 shadow-sm bg-gray-50/30">
                <h3 className="font-semibold mb-3 text-lg">
                  Product Information
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Product Name</label>
                    <input
                      name="name"
                      defaultValue={product.name}
                      className="border p-2 rounded w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Brand</label>
                    <input
                      name="brand"
                      defaultValue={product.brand}
                      className="border p-2 rounded w-full"
                      required
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={product.description}
                    className="border p-2 rounded w-full mt-1"
                  ></textarea>
                </div>

                {/* Thumbnail */}
                <div className="mt-4">
                  <label className="text-sm font-medium">
                    Product Thumbnail
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="thumbnail"
                    onChange={handleThumbnailChange}
                    className="border border-dashed border-gray-400 p-3 rounded w-full cursor-pointer mt-1"
                  />
                  {thumbnailPreview && (
                    <div className="mt-3 flex justify-center relative">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail Preview"
                        className="w-48 h-48 object-cover rounded-xl shadow"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveThumbnail}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 py-0.5 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Ảnh phụ */}
                <div className="mt-4">
                  <label className="text-sm font-medium">More Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    name="images"
                    onChange={handleImagesChange}
                    className="border border-dashed border-gray-400 p-3 rounded w-full cursor-pointer mt-1"
                  />
                  {imageObjects.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-3">
                      {imageObjects.map((img, i) => (
                        <div key={i} className="relative">
                          <img
                            src={img.url}
                            alt={`Preview ${i}`}
                            className="w-full h-24 object-cover rounded-lg shadow"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(i)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-1 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-3 mt-5">
                  {["cpu", "ram", "storage", "gpu", "screen"].map((f) => (
                    <input
                      key={f}
                      name={f}
                      defaultValue={(product as any)[f]}
                      placeholder={f.toUpperCase()}
                      className="border p-2 rounded"
                    />
                  ))}
                </div>
              </div>

              {/* Category & Stock */}
              <div className="border rounded-xl p-5 shadow-sm bg-gray-50/30">
                <h3 className="font-semibold mb-3 text-lg">
                  Inventory & Category
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select
                      name="categoryId"
                      defaultValue={product.categoryId}
                      className="border p-2 rounded w-full"
                      required
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Stock Quantity
                    </label>
                    <input
                      name="stock"
                      type="number"
                      defaultValue={product.stock}
                      className="border p-2 rounded w-full"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-6">
              <div className="border rounded-xl p-5 shadow-sm bg-gray-50/30">
                <h3 className="font-semibold mb-3 text-lg">Pricing</h3>
                <label className="text-sm font-medium">Price (VNĐ)</label>
                <input
                  name="price"
                  type="number"
                  defaultValue={product.price}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>

              <div className="border rounded-xl p-5 shadow-sm bg-gray-50/30">
                <h3 className="font-semibold mb-3 text-lg">Publish</h3>
                <label className="text-sm font-medium">Status</label>
                <select
                  name="status"
                  defaultValue={product.status}
                  className="border p-2 rounded w-full"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="col-span-3 flex justify-end pt-4 border-t mt-3">
              <DialogFooter className="flex justify-end gap-3">
                <Button
                  type="button"
                  className="bg-gray-300 text-gray-800 hover:bg-gray-400"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
