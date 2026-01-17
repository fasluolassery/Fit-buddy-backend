import { Router } from "express";
import container from "../config/inversify.config";
import TYPES from "../constants/types";
import IAuthController from "../controllers/interfaces/auth-controller.interface";
import { validate } from "../middlewares/validate.middleware";
import {
  forgotPasswordSchema,
  loginSchema,
  resendOtpSchema,
  resetPasswordSchema,
  signupSchema,
  verifyOtpSchema,
} from "../validators/auth.validator";
import { asyncHandler } from "../utils/async-handler.util";
import {
  googleAuth,
  googleCallbackAuth,
} from "../middlewares/google-auth.middleware";

const router: Router = Router();
const authController = container.get<IAuthController>(TYPES.IAuthController);

router.post(
  "/signup",
  validate(signupSchema),
  asyncHandler((req, res) => authController.signup(req, res)),
);

router.post(
  "/verify-otp",
  validate(verifyOtpSchema),
  asyncHandler((req, res) => authController.verifyOtp(req, res)),
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler((req, res) => authController.login(req, res)),
);

router.post(
  "/refresh",
  asyncHandler((req, res) => authController.refresh(req, res)),
);

router.post(
  "/logout",
  asyncHandler((req, res) => authController.logout(req, res)),
);

router.post(
  "/resend-otp",
  validate(resendOtpSchema),
  asyncHandler((req, res) => authController.resendOtp(req, res)),
);

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  asyncHandler((req, res) => authController.forgotPassword(req, res)),
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  asyncHandler((req, res) => authController.resetPassword(req, res)),
);

router.get("/google", googleAuth);

router.get("/google/callback", googleCallbackAuth, (req, res) =>
  authController.googleCallback(req, res),
);

export default router;
