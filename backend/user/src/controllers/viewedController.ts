// controllers/viewedController.ts
import { Request, Response } from "express";
import {
  getViewedProductsByUser,
  addRecentlyViewedProductByUser,
  removeViewedProductByUser,
} from "../services/viewService";

interface AuthRequest extends Request {
  user?: { id: number };
}

export const fetchRecentlyViewed = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const data = await getViewedProductsByUser(userId);
    res.json({ count: data.length, items: data });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const addProductViewed = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const productId = Number(req.params.productId);

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (isNaN(productId))
      return res.status(400).json({ message: "Invalid productId" });

    await addRecentlyViewedProductByUser(userId, productId);
    res.status(201).json({ message: "Added to recently viewed" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const deleteProductViewed = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const productId = Number(req.params.productId);

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (isNaN(productId))
      return res.status(400).json({ message: "Invalid productId" });

    await removeViewedProductByUser(userId, productId);
    res.status(201).json({ message: "Deleted to recently viewed" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
