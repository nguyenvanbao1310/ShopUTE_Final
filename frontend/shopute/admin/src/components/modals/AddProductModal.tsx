import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AddProductModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // --- HANDLE IMAGE INPUTS ---
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveThumbnail = () => setThumbnailPreview(null);
  const handleRemoveImage = (index: number) =>
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[96vw] sm:max-w-[96vw] lg:max-w-[1350px] h-[90vh] overflow-y-auto bg-white rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            ➕ Add New Product
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="mt-4 grid grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="col-span-2 flex flex-col gap-6">
            {/* Product Info */}
            <div className="border rounded-xl p-5 shadow-sm bg-gray-50/30">
              <h3 className="font-semibold mb-3 text-lg">
                Product Information
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Product Name</label>
                  <input
                    name="name"
                    className="border p-2 rounded w-full"
                    placeholder="Asus ROG Strix G15"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Brand</label>
                  <input
                    name="brand"
                    className="border p-2 rounded w-full"
                    placeholder="Asus"
                    required
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  className="border p-2 rounded w-full mt-1"
                  placeholder="Enter product description..."
                ></textarea>
              </div>

              {/* Thumbnail */}
              <div className="mt-4">
                <label className="text-sm font-medium">Product Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  name="thumbnail"
                  required
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

              {/* Multiple Images */}
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
                  placeholder="CPU"
                  className="border p-2 rounded"
                />
                <input
                  name="ram"
                  placeholder="RAM"
                  className="border p-2 rounded"
                />
                <input
                  name="storage"
                  placeholder="Storage"
                  className="border p-2 rounded"
                />
                <input
                  name="gpu"
                  placeholder="GPU"
                  className="border p-2 rounded"
                />
                <input
                  name="screen"
                  placeholder="Screen"
                  className="border p-2 rounded col-span-2"
                />
              </div>
            </div>

            {/* Category, Stock, etc. */}
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
                    className="border p-2 rounded w-full"
                    placeholder="1"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Stock Quantity</label>
                  <input
                    name="stock"
                    type="number"
                    className="border p-2 rounded w-full"
                    placeholder="10"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-6">
            {/* Pricing */}
            <div className="border rounded-xl p-5 shadow-sm bg-gray-50/30">
              <h3 className="font-semibold mb-3 text-lg">Pricing</h3>
              <div>
                <label className="text-sm font-medium">Price (VNĐ)</label>
                <input
                  name="price"
                  type="number"
                  className="border p-2 rounded w-full"
                  placeholder="32000000"
                  required
                />
              </div>
            </div>

            {/* Publish */}
            <div className="border rounded-xl p-5 shadow-sm bg-gray-50/30">
              <h3 className="font-semibold mb-3 text-lg">Publish</h3>
              <label className="text-sm font-medium">Status</label>
              <select
                name="status"
                className="border p-2 rounded w-full mb-3"
                defaultValue="ACTIVE"
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
              <Button type="submit">Add Product</Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
