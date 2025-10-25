import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Product, productApi } from "@/lib/productApi";

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
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Khi mở modal, tự load dữ liệu cũ
  useEffect(() => {
    if (product) {
      setThumbnailPreview(product.thumbnailUrl || null);

      // Gọi API để lấy ảnh phụ
      productApi.getImages(product.id).then((imgs) => {
        setImagePreviews(imgs.map((img) => img.url));
      });
    }
  }, [product]);

  // --- IMAGE HANDLERS ---
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    // ✅ Giữ lại ảnh cũ + thêm ảnh mới
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveThumbnail = () => setThumbnailPreview(null);
  const handleRemoveImage = (index: number) =>
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!product) return;
    const formData = new FormData(e.currentTarget);
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
          <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-3 gap-6">
            {/* LEFT SECTION */}
            <div className="col-span-2 flex flex-col gap-6">
              {/* Product Info */}
              <div className="border rounded-xl p-5 shadow-sm bg-gray-50/30">
                <h3 className="font-semibold mb-3 text-lg">
                  Product Information
                </h3>

                {/* Basic Info */}
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

                {/* Thumbnail Upload */}
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

                {/* ✅ Multiple Images Upload */}
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
                  {imagePreviews.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-3">
                      {imagePreviews.map((src, i) => (
                        <div key={i} className="relative">
                          <img
                            src={src}
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
                  <input
                    name="cpu"
                    defaultValue={product.cpu}
                    placeholder="CPU"
                    className="border p-2 rounded"
                  />
                  <input
                    name="ram"
                    defaultValue={product.ram}
                    placeholder="RAM"
                    className="border p-2 rounded"
                  />
                  <input
                    name="storage"
                    defaultValue={product.storage}
                    placeholder="Storage"
                    className="border p-2 rounded"
                  />
                  <input
                    name="gpu"
                    defaultValue={product.gpu}
                    placeholder="GPU"
                    className="border p-2 rounded"
                  />
                  <input
                    name="screen"
                    defaultValue={product.screen}
                    placeholder="Screen"
                    className="border p-2 rounded col-span-2"
                  />
                </div>
              </div>

              {/* Category & Stock */}
              <div className="border rounded-xl p-5 shadow-sm bg-gray-50/30">
                <h3 className="font-semibold mb-3 text-lg">
                  Inventory & Category
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Category ID</label>
                    <input
                      name="categoryId"
                      type="number"
                      defaultValue={product.categoryId}
                      className="border p-2 rounded w-full"
                      required
                    />
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

            {/* RIGHT SECTION */}
            <div className="flex flex-col gap-6">
              <div className="border rounded-xl p-5 shadow-sm bg-gray-50/30">
                <h3 className="font-semibold mb-3 text-lg">Pricing</h3>
                <div>
                  <label className="text-sm font-medium">Price (VNĐ)</label>
                  <input
                    name="price"
                    type="number"
                    defaultValue={product.price}
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>
              </div>

              <div className="border rounded-xl p-5 shadow-sm bg-gray-50/30">
                <h3 className="font-semibold mb-3 text-lg">Publish</h3>
                <label className="text-sm font-medium">Status</label>
                <select
                  name="status"
                  defaultValue={product.status}
                  className="border p-2 rounded w-full mb-3"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="col-span-3 flex justify-end pt-4 border-t mt-3">
              <DialogFooter className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={onClose}>
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
