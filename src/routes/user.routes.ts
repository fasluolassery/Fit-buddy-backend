import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/async-handler.util";
import container from "../config/inversify.config";
import TYPES from "../constants/types";
import IUserController from "../controllers/interfaces/user-controller.interface";

const router = Router();
const userController = container.get<IUserController>(TYPES.IUserController);

router.get(
  "/me",
  authMiddleware,
  asyncHandler((req, res) => userController.me(req, res)),
);

export default router;
