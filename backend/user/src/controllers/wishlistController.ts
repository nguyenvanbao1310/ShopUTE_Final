import { Request, Response } from "express";
import * as wishlistService from "../services/wishlistService";

interface AuthRequest extends Request {
  user?: { id: number };
}

// Lấy toàn bộ wishlist
export const getUserWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const wishlist = await wishlistService.getWishlistByUser(userId);
    return res.json({ count: wishlist.length, items: wishlist });
  } catch (err) {
    console.error("Get wishlist error:", err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};

// Thêm sản phẩm vào wishlist
export const addToWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const productId = Number(req.params.productId);

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (isNaN(productId))
      return res.status(400).json({ message: "Invalid productId" });

    const newItem = await wishlistService.addProductToWishlist(
      userId,
      productId
    );
    return res
      .status(201)
      .json({ message: "Added to wishlist", item: newItem });
  } catch (err: any) {
    console.error("Add wishlist error:", err);
    return res
      .status(400)
      .json({ message: err.message || "Server error", error: err });
  }
};

// Xoá sản phẩm khỏi wishlist
export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const productId = Number(req.params.productId);

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (isNaN(productId))
      return res.status(400).json({ message: "Invalid productId" });

    await wishlistService.removeProductFromWishlist(userId, productId);
    return res.json({ message: "Removed from wishlist" });
  } catch (err: any) {
    console.error("Remove wishlist error:", err);
    return res
      .status(404)
      .json({ message: err.message || "Server error", error: err });
  }
};
