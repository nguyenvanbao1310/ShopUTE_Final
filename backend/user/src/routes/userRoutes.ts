import express, { Request, Response } from "express";
import { Router } from "express";
import { authMiddleware  } from "../middleware/auth";
import userController from "../controllers/userControllers";

const router = Router();

router.get("/profile", authMiddleware, userController.getInforUser);
router.put("/profile/updateInfor", authMiddleware, userController.updateInforUser);
router.put("/profile/changePassword", authMiddleware, userController.changePasswordUser);
router.put("/profile/confirmChangePassword", authMiddleware, userController.confirmChangePassword);
export default router;
    