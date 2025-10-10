import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  createProductImageSvc,
  updateProductImageSvc,
  getAllProductImagesSvc,
} from "../services/productImageService";

export async function createProductImage(req: AuthRequest, res: Response) {
  try {
    const data = await createProductImageSvc(req.body);
    res.status(201).json(data);
  } catch (e: any) {
    res.status(e?.status || 500).json({ message: e?.message || "Internal Server Error" });
  }
}

export async function updateProductImage(req: AuthRequest, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid productImage id" });
    const data = await updateProductImageSvc(id, req.body);
    res.json(data);
  } catch (e: any) {
    res.status(e?.status || 500).json({ message: e?.message || "Internal Server Error" });
  }
}

export async function getAllProductImages(_req: AuthRequest, res: Response) {
  try {
    const data = await getAllProductImagesSvc();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
