"use client";

import React from "react";
import type { AdminComment } from "@/types/comment";

export function CommentTable({
  comments,
}: {
  comments: AdminComment[];
}) {
  const userWebBase = process.env.NEXT_PUBLIC_USER_WEB_URL || "http://localhost:3000";
  const toVNDate = (d: string | Date) =>
    new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

  const openProductPage = (productId: number) => {
    const base = userWebBase.replace(/\/$/, "");
    const url = `${base}/product/${productId}`;
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội dung đánh giá</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người đánh giá</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đánh giá</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {comments.map((c) => (
            <tr
              key={c.id}
              className="hover:bg-gray-50 cursor-pointer"
              role="link"
              tabIndex={0}
              onClick={() => openProductPage(c.productId)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openProductPage(c.productId);
                }
              }}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.productName}</td>
              <td className="px-6 py-4 whitespace-normal text-sm text-gray-700">
                {c.comment ?? "(Không có nội dung)"}
                {c.containsProfanity && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                    Nhạy cảm
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.rating.toFixed ? c.rating.toFixed(1) : c.rating}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{c.userName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.userEmail ?? "-"}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{toVNDate(c.createdAt)}</td>
            </tr>
          ))}
          {comments.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                Không có đánh giá nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CommentTable;

