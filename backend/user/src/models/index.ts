import Category from "./Category";
import Product from "./Product";
import ProductImage from "./ProductImage";
import Order from "./Order";
import OrderDetail from "./OrderDetail";
import ProductDiscount from "./ProductDiscount";
import Cart from "./Cart";
import User from "./User";
import CartItem from "./CartItem";
import CancelRequest from "./CancelRequest";
import Rating from "./rating";
import Coupon from "./Coupon";
import Wishlist from "./Wishlist";
import ViewedProduct from "./ViewedProduct";

export function associateModels() {
  Category.belongsTo(Category, {
    as: "parent",
    foreignKey: "parentId",
  });
  // Category ↔ Product
  Category.hasMany(Product, { as: "Products", foreignKey: "categoryId" });
  Product.belongsTo(Category, { as: "Category", foreignKey: "categoryId" });

  // Product ↔ ProductImage
  Product.hasMany(ProductImage, { as: "Images", foreignKey: "productId" });
  ProductImage.belongsTo(Product, { as: "Product", foreignKey: "productId" });

  // Order ↔ OrderDetail
  Order.hasMany(OrderDetail, { as: "OrderDetails", foreignKey: "orderId" });
  OrderDetail.belongsTo(Order, { as: "Order", foreignKey: "orderId" });

  // Product ↔ OrderDetail
  Product.hasMany(OrderDetail, { as: "OrderDetails", foreignKey: "productId" });
  OrderDetail.belongsTo(Product, { as: "Product", foreignKey: "productId" });

  // Product ↔ ProductDiscount
  Product.hasOne(ProductDiscount, { as: "discount", foreignKey: "productId" });
  ProductDiscount.belongsTo(Product, {
    as: "product",
    foreignKey: "productId",
  });

  // User ↔ ViewedProduct
  User.hasMany(ViewedProduct, { as: "ViewedProducts", foreignKey: "userId" });
  ViewedProduct.belongsTo(User, { as: "User", foreignKey: "userId" });

  // Product ↔ ViewedProduct
  Product.hasMany(ViewedProduct, {
    as: "ViewedProducts",
    foreignKey: "productId",
  });
  ViewedProduct.belongsTo(Product, { as: "Product", foreignKey: "productId" });

  // ===== Associations cho Cart =====
  User.hasOne(Cart, {
    foreignKey: "userId",
    as: "cart",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Cart.belongsTo(User, { foreignKey: "userId", as: "user" });

  Cart.hasMany(CartItem, {
    foreignKey: "cartId",
    as: "items",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  CartItem.belongsTo(Cart, { foreignKey: "cartId", as: "cart" });

  Product.hasMany(CartItem, {
    foreignKey: "productId",
    as: "cartItems",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  });
  CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

  Order.hasMany(CancelRequest, {
    as: "CancelRequests",
    foreignKey: "orderId",
    onDelete: "CASCADE",
  });
  CancelRequest.belongsTo(Order, { as: "Order", foreignKey: "orderId" });

  User.hasMany(CancelRequest, {
    as: "CancelRequests",
    foreignKey: "userId",
    onDelete: "SET NULL",
  });
  CancelRequest.belongsTo(User, { as: "User", foreignKey: "userId" });

  // Ratings associations
  Product.hasMany(Rating, { as: "Ratings", foreignKey: "productId" });
  Rating.belongsTo(Product, { as: "Product", foreignKey: "productId" });
  User.hasMany(Rating, { as: "Ratings", foreignKey: "userId" });
  Rating.belongsTo(User, { as: "User", foreignKey: "userId" });

  // Coupon associations
  User.hasMany(Coupon, { as: "Coupons", foreignKey: "userId" });
  Coupon.belongsTo(User, { as: "User", foreignKey: "userId" });

  // Wishlist associations
  User.hasMany(Wishlist, { as: "Wishlists", foreignKey: "userId" });
  Wishlist.belongsTo(User, { as: "User", foreignKey: "userId" });

  Product.hasMany(Wishlist, { as: "Wishlists", foreignKey: "productId" });
  Wishlist.belongsTo(Product, { as: "Product", foreignKey: "productId" });
}

export {
  Category,
  Product,
  ProductImage,
  Order,
  OrderDetail,
  ProductDiscount,
  User,
  Cart,
  CartItem,
  CancelRequest,
  Rating,
  Coupon,
  Wishlist,
  ViewedProduct,
};
