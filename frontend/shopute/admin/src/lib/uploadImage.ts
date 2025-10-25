export async function uploadImage(file: File): Promise<string> {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8888";

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/api/products/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("❌ Upload image failed");
  const data = await res.json();
  // data.url = "uploads/products/xxx.jpg"
  return data.url;
}
