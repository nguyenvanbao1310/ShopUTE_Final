import React from "react";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOtp";
import CategoryList from "./components/home/CategoryList";
import CategoryPage from "./components/home/CategoryPage";
import ProductDetail from "./components/home/ProductDetail";
import CartPage from "./pages/Cart";

import AccountLayout from "./pages/account/AccountLayout";
import Profile from "./pages/account/Profile";
import Address from "./pages/account/Address";
import ChangePassword from "./pages/account/ChangePassword";
import Checkout from "./pages/CheckOut/Checkout";
import OrderList from "./components/OrderList";
import WishlistPage from "./pages/wishlist/WishlistPage";
import ViewedProductsPage from "./pages/viewedProduct/ViewedProductsPage";
import CheckoutComplete from "./pages/CheckOut/CheckoutComplete"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<AccountLayout />}>
          <Route path="profile" element={<Profile />} />
          <Route path="address" element={<Address />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
		    <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/complete" element={<CheckoutComplete />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="viewed" element={<ViewedProductsPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<CategoryList />} />
        <Route path="category/:categoryName" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
