"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  Gift,
  Users,
  FileText,
  Settings,
} from "lucide-react";
interface SidebarProps {
  isOpen: boolean;
  activeMenu: string;
  onMenuClick: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  activeMenu,
  onMenuClick,
}) => {
  const router = useRouter();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      id: "products",
      label: "Quản lý sản phẩm",
      icon: Package,
      path: "/products",
    },
    { id: "orders", label: "Quản lý đơn hàng", icon: ShoppingCart },
    { id: "categories", label: "Quản lý danh mục", icon: FolderTree },
    { id: "promotions", label: "Quản lý khuyến mãi", icon: Gift },
    { id: "customers", label: "Quản lý khách hàng", icon: Users },
    { id: "reports", label: "Báo cáo", icon: FileText },
    { id: "settings", label: "Cài đặt", icon: Settings },
  ];

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-white border-r border-gray-200 transition-all duration-300`}
    >
      <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-200">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">SU</span>
        </div>
        {isOpen && (
          <span className="font-bold text-xl text-gray-800">ShopUte</span>
        )}
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onMenuClick(item.id);
                if (item.path) router.push(item.path);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-purple-50 text-purple-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon size={20} />
              {isOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
