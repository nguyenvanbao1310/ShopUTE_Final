import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { createProductRatingSvc, getProductRatingsSvc } from "../services/ratingService";

export async function listProductRatings(req: AuthRequest, res: Response) {
  try {
    const productId = Number(req.params.id);
    if (Number.isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    const data = await getProductRatingsSvc(productId);
    return res.json(data);
  } catch (e: any) {
    return res.status(e?.status || 500).json({ message: e?.message || "Internal Server Error" });
  }
}

export async function createProductRating(req: AuthRequest, res: Response) {
  try {
    const productId = Number(req.params.id);
    if (Number.isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const data = await createProductRatingSvc(productId, Number(userId), req.body);
    return res.status(201).json(data);
  } catch (e: any) {
    return res.status(e?.status || 500).json({ message: e?.message || "Internal Server Error" });
  }
}

