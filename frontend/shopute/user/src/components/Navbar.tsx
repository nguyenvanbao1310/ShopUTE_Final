import { Link } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 w-full mb-6">
      {/* Container chính */}
      <div className="w-full flex flex-col items-center px-4 py-2">
        {/* Logo + Search + Cart */}
        <div className="w-full flex items-center justify-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="img/background_uteshop.png"
              alt="UTEShop"
              className="h-"
            />
          </div>

          {/* Thanh search với icon */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Account / Cart */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <button className="hover:text-green-600">Cart 🛒</button>
          </div>
        </div>

        {/* Menu dưới logo + search */}
        <div className="flex flex-wrap justify-center gap-6 mt-3 text-gray-700 text-sm">
          <button className="hover:text-green-600">Categories</button>
          <button className="hover:text-green-600">Special</button>
          <button className="hover:text-green-600">Brands</button>
          <button className="hover:text-green-600">New</button>
          <button className="hover:text-green-600">Featured</button>
          <button className="hover:text-green-600">Reviews</button>
          <button className="hover:text-green-600">Information</button>
          <button className="hover:text-green-600">Admin</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
