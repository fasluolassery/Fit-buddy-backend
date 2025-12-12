import { Router } from "express";
import container from "../config/inversify.config";
import TYPES from "../constants/types";
import IAuthController from "../controllers/interfaces/auth-controller.interface";

const router: Router = Router();

const authController = container.get<IAuthController>(TYPES.IAuthController);

router.post("/signup", (req, res) => authController.signup(req, res));

export default router;
