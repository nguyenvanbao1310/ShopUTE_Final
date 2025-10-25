import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import * as notificationController from "../controllers/notificationController";
const router = Router();

router.use(authMiddleware);
router.get("/", notificationController.getNotifications);
router.patch("/:id/read", notificationController.markAsRead);
router.patch("/read-all", notificationController.markAll);
router.delete("/:id", notificationController.removeNotification);
export default router;