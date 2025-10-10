import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../store/authSlice";
import UserMenu from "./miniMenu";
import { Search } from "lucide-react";
import { useEffect } from "react";
import { fetchCart, mergeGuestCart } from "../store/cartSlice";

const Header = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    (dispatch as any)(fetchCart());
  };

  const totalQuantity = useSelector((s: any) => s.cart?.cart?.totalQuantity || 0);

  const token = useSelector((state: RootState) => state.auth.token);
  useEffect(() => {
    if (isAuthenticated) {
      // Merge guest cart into user cart then refresh
      (dispatch as any)(mergeGuestCart());
    } else {
      // Refresh guest cart
      (dispatch as any)(fetchCart());
    }
  }, [dispatch, token, isAuthenticated]);

  return (
    <header className=" sticky top-0 z-50 relative">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 mr-6">
          <img
            src="img/background_uteshop.png"
            alt="UTEShop"
            style={{ height: "60px", width: "auto" }}
            className="rounded-md bg-white"
          />
        </Link>

        {/* Thanh search + Cart/Auth */}
        <nav className="flex-1 flex items-center justify-between">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Cart + Auth */}
          <div className="flex items-center gap-4 text-sm text-gray-600 ml-6">
            <Link to="/cart" className="relative hover:text-green-600">
              <span>Cart 🛒</span>
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {totalQuantity}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <UserMenu  user={{ ...user, name: `${user?.firstName || ""} ${user?.lastName || ""}` }} handleLogout={handleLogout} />
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-700 hover:text-green-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Menu dưới trùng biên với thanh search */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 py-4 text-gray-700 text-base ">
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
    </header>
  );
};

export default Header;
