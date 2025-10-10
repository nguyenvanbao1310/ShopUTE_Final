import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  createCategorySvc,
  updateCategorySvc,
  getAllCategoriesSvc,
} from "../services/categoryService";

export async function createCategory(req: AuthRequest, res: Response) {
  try {
    const data = await createCategorySvc(req.body);
    res.status(201).json(data);
  } catch (e: any) {
    res
      .status(e?.status || 500)
      .json({ message: e?.message || "Internal Server Error" });
  }
}

export async function updateCategory(req: AuthRequest, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id))
      return res.status(400).json({ message: "Invalid category id" });
    const data = await updateCategorySvc(id, req.body);
    res.json(data);
  } catch (e: any) {
    res
      .status(e?.status || 500)
      .json({ message: e?.message || "Internal Server Error" });
  }
}

export async function getAllCategories(_req: AuthRequest, res: Response) {
  try {
    const data = await getAllCategoriesSvc();
    res.json(data);
  } catch (e: any) {
    console.error("Error in getAllCategories:", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
