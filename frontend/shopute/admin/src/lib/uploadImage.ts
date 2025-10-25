export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );

  const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_API_URL!, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload ảnh thất bại");
  }

  const data = await res.json();
  return data.secure_url as string; // ✅ URL ảnh public trên Cloudinary
};

export const uploadMultipleImages = async (
  files: File[]
): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadImage(file));
  const urls = await Promise.all(uploadPromises);
  return urls;
};
