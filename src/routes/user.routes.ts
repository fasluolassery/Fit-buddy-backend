import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/async-handler.util";
import container from "../config/inversify.config";
import TYPES from "../constants/types";
import IUserController from "../controllers/interfaces/user-controller.interface";
import { requireRole } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { userOnboardingSchema } from "../validators/onboarding.validator";

const router = Router();
const userController = container.get<IUserController>(TYPES.IUserController);

router.patch(
  "/onboarding",
  authMiddleware,
  requireRole("user"),
  validate(userOnboardingSchema),
  asyncHandler((req, res) => userController.userOnboarding(req, res)),
);

export default router;
