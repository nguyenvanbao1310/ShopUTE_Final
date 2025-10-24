"use client";

import { useState } from "react";
import { AdminButton } from "@/components/ui/AdminButton";
import { Card, CardContent } from "@/components/ui/Card";
import { Eye, Pencil, Trash2, Star, Plus, ChevronDown } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  totalStock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  rating: number;
  publishedAt: string;
};

export default function ProductsPage() {
  const [products] = useState<Product[]>([
    {
      id: "#PRD-2024-001",
      name: "Smartphone X Pro",
      sku: "SMX-PRO-256",
      category: "Electronics",
      price: 899.99,
      stock: 78,
      totalStock: 120,
      status: "In Stock",
      rating: 4.8,
      publishedAt: "28 Apr, 2025 01:05 PM",
    },
    {
      id: "#PRD-2024-002",
      name: "Wireless Earbuds Pro",
      sku: "WEB-PRO-202",
      category: "Audio",
      price: 129.99,
      stock: 3,
      totalStock: 20,
      status: "Low Stock",
      rating: 4.5,
      publishedAt: "27 Apr, 2025 10:30 AM",
    },
    {
      id: "#PRD-2024-003",
      name: "Smart Watch Series 7",
      sku: "SWS-7-BLK",
      category: "Wearables",
      price: 249.99,
      stock: 36,
      totalStock: 50,
      status: "In Stock",
      rating: 4.9,
      publishedAt: "26 Apr, 2025 03:45 PM",
    },
  ]);

  const [sortBy, setSortBy] = useState("Newest");

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* --- Summary Cards --- */}
        <div className="grid grid-cols-4 gap-4">
          <SummaryCard
            title="Total Products"
            value="8,450"
            sub="+10.5% vs Last Month"
            color="bg-indigo-100 text-indigo-600"
          />
          <SummaryCard
            title="Available Stock"
            value="5,320"
            sub="+8.2% Stock Growth"
            color="bg-green-100 text-green-600"
          />
          <SummaryCard
            title="Total Sales"
            value="12,980"
            sub="+15.3% Monthly Sales"
            color="bg-orange-100 text-orange-600"
          />
          <SummaryCard
            title="Out of Stock"
            value="120"
            sub="-2.5% vs Last Month"
            color="bg-red-100 text-red-600"
          />
        </div>

        {/* --- Product Table --- */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">Product List</h2>
                <p className="text-sm text-gray-500">
                  Manage your store inventory efficiently
                </p>
              </div>

              <div className="flex gap-3 items-center">
                {/* Sort By */}
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
                    <option>Top Rated</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>

                {/* Add Product */}
                <AdminButton variant="primary">Add Product</AdminButton>
                <AdminButton variant="secondary">Export as CSV</AdminButton>
              </div>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left text-gray-600">
                  <th className="p-2">ID</th>
                  <th className="p-2">Product</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Stock</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Rating</th>
                  <th className="p-2">Published</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{p.id}</td>
                    <td className="p-2">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-sm text-gray-500">SKU: {p.sku}</div>
                    </td>
                    <td className="p-2">{p.category}</td>
                    <td className="p-2">${p.price.toFixed(2)}</td>
                    <td className="p-2">
                      {p.stock}/{p.totalStock}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          p.status === "In Stock"
                            ? "bg-green-100 text-green-600"
                            : p.status === "Low Stock"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-2 flex items-center gap-1">
                      <Star className="text-yellow-500 w-4 h-4" /> {p.rating}
                    </td>
                    <td className="p-2 text-gray-600">{p.publishedAt}</td>
                    <td className="p-2 flex justify-center gap-2">
                      <Eye className="text-green-600 cursor-pointer w-5 h-5" />
                      <Pencil className="text-blue-600 cursor-pointer w-5 h-5" />
                      <Trash2 className="text-red-600 cursor-pointer w-5 h-5" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

function SummaryCard({
  title,
  value,
  sub,
  color,
}: {
  title: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-xl ${color} mb-3`}
        ></div>
        <h4 className="text-gray-500 text-sm">{title}</h4>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-gray-500">{sub}</div>
      </CardContent>
    </Card>
  );
}
