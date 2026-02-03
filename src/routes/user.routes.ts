import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/async-handler.util";
import container from "../config/inversify.config";
import TYPES from "../constants/types";
import IUserController from "../controllers/interfaces/user-controller.interface";
import { requireRole } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  trainerOnboardingSchema,
  userOnboardingSchema,
} from "../validators/onboarding.validator";
import { multerFields, upload } from "../config/multer.config";
import { requireFiles } from "../middlewares/validate-files.middleware";

const router = Router();
const userController = container.get<IUserController>(TYPES.IUserController);

router.get(
  "/me",
  authMiddleware,
  asyncHandler((req, res) => userController.me(req, res)),
);

router.patch(
  "/onboarding/user",
  authMiddleware,
  requireRole("user"),
  validate(userOnboardingSchema),
  asyncHandler((req, res) => userController.userOnboarding(req, res)),
);

router.patch(
  "/onboarding/trainer",
  authMiddleware,
  requireRole("trainer"),
  upload.fields(multerFields),
  validate(trainerOnboardingSchema),
  requireFiles({ profilePhoto: true, certificates: true }),
  asyncHandler((req, res) => userController.trainerOnboarding(req, res)),
);

router.get(
  "/admin/users",
  authMiddleware,
  requireRole("admin"),
  asyncHandler((req, res) => userController.getUsersForAdmin(req, res)),
);

router.patch(
  "/admin/users/:id/block",
  authMiddleware,
  requireRole("admin"),
  asyncHandler((req, res) => userController.blockUser(req, res)),
);

router.patch(
  "/admin/users/:id/unblock",
  authMiddleware,
  requireRole("admin"),
  asyncHandler((req, res) => userController.unblockUser(req, res)),
);

export default router;
