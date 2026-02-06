import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { asyncHandler } from "../utils/async-handler.util";
import container from "../config/inversify.config";
import TYPES from "../constants/types";
import IAdminController from "../controllers/interfaces/admin-controller.interface";

const router = Router();
const adminController = container.get<IAdminController>(TYPES.IAdminController);

router.get(
  "/users",
  authMiddleware,
  requireRole("admin"),
  asyncHandler((req, res) => adminController.getUsers(req, res)),
);

router.patch(
  "/users/:id/block",
  authMiddleware,
  requireRole("admin"),
  asyncHandler((req, res) => adminController.blockUserOrTrainer(req, res)),
);

router.patch(
  "/users/:id/unblock",
  authMiddleware,
  requireRole("admin"),
  asyncHandler((req, res) => adminController.unblockUserOrTrainer(req, res)),
);

router.get(
  "/trainers",
  authMiddleware,
  requireRole("admin"),
  asyncHandler((req, res) => adminController.getTrainers(req, res)),
);

router.patch(
  "/trainers/:id/approve",
  authMiddleware,
  requireRole("admin"),
  asyncHandler((req, res) => adminController.approveTrainer(req, res)),
);

router.patch(
  "/trainers/:id/reject",
  authMiddleware,
  requireRole("admin"),
  asyncHandler((req, res) => adminController.rejectTrainer(req, res)),
);

export default router;
