import { useState } from "react";
import { Link } from "react-router-dom";

const UserMenu = ({ user, handleLogout }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Avatar */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <img
          src={user?.avatar || "/logo192.png"}
          alt="avatar"
          className="w-8 h-8 rounded-full border"
        />
        <span className="text-gray-700">{user?.name || user?.email}</span>

      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
          <ul className="py-2 text-sm text-gray-700">
            <li>
              <Link
                to="/account"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Thông tin tài khoản
              </Link>
            </li>
            <li>
              <Link
                to="/orders"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Đơn hàng
              </Link>
            </li>
            <li>
              <Link
                to="/wishlist"
                className="block px-4 py-2 hover:bg-gray-100 "
                onClick={() => setOpen(false)}
              >
                Yêu thích
              </Link>
            </li>
            <li>
              <Link
                to="/viewed"
                className="block px-4 py-2 hover:bg-gray-100 "
                onClick={() => setOpen(false)}
              >
                Lịch sử xem
              </Link>
            </li>
            <li>
              <Link
                to="/change-password"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Đổi mật khẩu
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="w-full text-left block px-4 py-2 hover:bg-gray-100 text-red-500"
              >
                Đăng xuất
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
