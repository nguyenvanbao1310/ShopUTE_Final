import { Link, Outlet, useLocation } from "react-router-dom";
import Layout from "../../layouts/MainLayout";
export default function AccountLayout() {
  const location = useLocation();

  const menus = [
    { path: "/account/profile", label: "Hồ sơ" },
    { path: "/account/address", label: "Địa chỉ" },
    { path: "/account/change-password", label: "Đổi mật khẩu" },
  ];

  return (
      <Layout>
    <div className="flex bg-gray-50 min-h-screen py-8">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow rounded-lg p-6 border-r">
        <h2 className="text-lg font-bold text-gray-700 mb-6">
          Tài khoản của tôi
        </h2>
        <ul className="space-y-3">
          {menus.map((menu) => (
            <li key={menu.path}>
              <Link
                to={menu.path}
                className={`block px-3 py-2 rounded-md transition ${
                  location.pathname === menu.path
                    ? "bg-green-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {menu.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-white shadow rounded-lg p-8 ml-6">
        <Outlet />
      </main>
    </div>
    </Layout>
  );
}
