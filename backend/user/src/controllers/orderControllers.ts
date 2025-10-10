import type { Request, Response } from "express";
import * as orderService from "../services/orderService";
import type { CancelResult } from "../services/orderService";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
     const payload = req.body as orderService.CreateOrderInput;
    if (userId) {
      payload.userId = userId;
    }
   const { order, details } = await orderService.createOrder(payload);
    res.status(201).json({ message: "Tạo đơn hàng thành công",order, details });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
};

export const confirmOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const result = await orderService.confirmOrder(Number(orderId));
    res.status(201).json(result);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
};

export const shipOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const result = await orderService.shipOrder(Number(orderId));
    res.status(201).json(result);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const orders = await orderService.getUserOrders(userId);
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const cancelOrderPending = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    if (!orderId)
      return res.status(400).json({ message: "orderId is required" });

    const result: CancelResult = await orderService.cancelPendingOrder(
      Number(orderId)
    );
    return res.json(result);
  } catch (error: any) {
    console.error(error);
    return res
      .status(400)
      .json({ message: error.message || "Cannot cancel order" });
  }
};

// Gửi yêu cầu hủy đơn CONFIRMED
export const requestCancelOrder = async (req: Request, res: Response) => {
  try {
    const { orderId, reason } = req.body;
    const userId = (req as any).user?.id; // authMiddleware gắn user vào req

    if (!orderId)
      return res.status(400).json({ message: "orderId is required" });

    const result: CancelResult = await orderService.requestCancelOrder(
      Number(orderId),
      userId,
      reason
    );

    return res.json(result);
  } catch (error: any) {
    console.error(error);
    return res
      .status(400)
      .json({ message: error.message || "Cannot request cancel order" });
  }
};
