"use client";

import React from "react";
import { useComments } from "@/hooks/useComments";
import { CommentTable } from "@/components/comment/CommentTable";

export default function AdminCommentsPage() {
  const { comments, loading } = useComments({ limit: 100 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Quản lý đánh giá</h1>
        {loading && (
          <span className="text-sm text-gray-500">Đang tải...</span>
        )}
      </div>
      <CommentTable comments={comments} />
    </div>
  );
}

