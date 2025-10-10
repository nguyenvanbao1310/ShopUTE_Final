import { Request, Response } from "express";
import * as CartService from "../services/cartService";

function ctx(req: Request) {
  const userId = (req as any).user?.id ?? null;
  const deviceId = (req as any).deviceId ?? null;
  return { userId, deviceId };
}

export const getCart = async (req: Request, res: Response) => {
  try {
    const data = await CartService.getCartDetailWithDiscount(ctx(req));
    return res.json({ success: true, data });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message || "GET_CART_FAILED" });
  }
};

export const addItem = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: "productId required" });
    const item = await CartService.addItem(ctx(req), Number(productId), Number(quantity || 1));
    return res.status(201).json({ success: true, itemId: item.id });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message || "ADD_ITEM_FAILED" });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity, selected } = req.body;
    const item = await CartService.updateItem(ctx(req), Number(id), { quantity, selected });
    return res.json({ success: true, itemId: item.id });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message || "UPDATE_ITEM_FAILED" });
  }
};

export const removeItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await CartService.removeItem(ctx(req), Number(id));
    return res.json({ success: true });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message || "REMOVE_ITEM_FAILED" });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    await CartService.clearCart(ctx(req));
    return res.json({ success: true });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message || "CLEAR_CART_FAILED" });
  }
};

export const toggleSelectAll = async (req: Request, res: Response) => {
  try {
    const { selected } = req.body;
    await CartService.toggleSelectAll(ctx(req), !!selected);
    return res.json({ success: true });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message || "TOGGLE_SELECT_ALL_FAILED" });
  }
};

export const mergeGuestCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "LOGIN_REQUIRED" });

    const { deviceId } = req.body;
    if (!deviceId) return res.status(400).json({ success: false, message: "deviceId required" });

    await CartService.mergeGuestCartToUser(userId, deviceId);
    const data = await CartService.getCartDetailWithDiscount({ userId, deviceId: null });
    return res.json({ success: true, data });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message || "MERGE_FAILED" });
  }
};
