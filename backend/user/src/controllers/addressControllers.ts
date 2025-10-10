import { Request, Response } from "express";
import * as addressService from "../services/addressService";

export const createAddress = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id; // lấy từ middleware auth (JWT chẳng hạn)
        const { street, ward, province,phone, isDefault} = req.body;
        const address = `${street}, ${ward}, ${province}`;
        const newAddress = await addressService.createAddress(
            userId,
            street,
            ward,
            province,
            address,phone, isDefault
        );
         return res.status(201).json({
            success: true,
            data: newAddress,
            });
    } catch (error:any) {
        return res.status(400).json({
        success: false,
        message: error.message || "Create Address Failed",
        });
    }
}
export const updateAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const addID = Number(req.params.id);
    const { street, ward, province,phone, isDefault } = req.body;
    const address = `${street}, ${ward}, ${province}`;
    const updated = await addressService.updateAddress(
      userId,
      addID,
      street,
      ward,
      province,
      address,phone,
      isDefault
    );

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Update Address Failed",
    });
  }
};

// Xóa địa chỉ
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const addID = Number(req.params.id);

    const deleted = await addressService.deleteAddress(userId, addID);

    return res.status(200).json({
      success: true,
      data: deleted,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Delete Address Failed",
    });
  }
};

// Lấy địa chỉ mặc định
export const getDefaultAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const addr = await addressService.getDefaultAddress(userId);

    return res.status(200).json({
      success: true,
      data: addr,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Default Address Not Found",
    });
  }
};
export const getAllAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const addr = await addressService.getAllAddress(userId);
    return res.status(200).json({
        success: true,
        data: addr,
    });
    } catch (error: any) {
    return res.status(400).json({
        success: false,
        message: error.message || "Get All Address Failed",
    });
    }
};
export async function getAddressById(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const addID = Number(req.params.id);
    const data = await addressService.getAddressById(userId, addID);
    return res.status(200).json({success: true , data});
  } catch (e: any) {
    res.status(400).json({ message: e?.message || "Get Address By Id Failed" });
  }
}