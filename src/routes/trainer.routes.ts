import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { multerFields, upload } from "../config/multer.config";
import { requireRole } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { trainerOnboardingSchema } from "../validators/onboarding.validator";
import { requireFiles } from "../middlewares/validate-files.middleware";
import { asyncHandler } from "../utils/async-handler.util";
import container from "../config/inversify.config";
import ITrainerController from "../controllers/interfaces/trainer-controller.interface";
import TYPES from "../constants/types";

const router = Router();
const trainercontroller = container.get<ITrainerController>(
  TYPES.ITrainerController,
);

router.patch(
  "/onboarding/trainer",
  authMiddleware,
  requireRole("trainer"),
  upload.fields(multerFields),
  validate(trainerOnboardingSchema),
  requireFiles({ profilePhoto: true, certificates: true }),
  asyncHandler((req, res) => trainercontroller.onboardTrainer(req, res)),
);
