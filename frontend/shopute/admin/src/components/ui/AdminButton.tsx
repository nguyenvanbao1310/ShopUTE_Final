"use client";
import React from "react";
import { cn } from "@/lib/util"; // hoặc tự định nghĩa nhỏ gọn

interface AdminButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

export const AdminButton: React.FC<AdminButtonProps> = ({
  className,
  variant = "primary",
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
  };

  return (
    <button
      className={cn(
        baseStyle,
        variants[variant],
        "py-1.5 px-3 text-sm", // 👈 mặc định gọn gàng
        className
      )}
      {...props}
    />
  );
};
