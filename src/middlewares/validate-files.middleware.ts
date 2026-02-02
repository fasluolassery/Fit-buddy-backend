import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../common/errors";

export type TrainerMulterFiles = {
  profilePhoto?: Express.Multer.File[];
  certificates?: Express.Multer.File[];
};

export const requireFiles =
  (rules: { profilePhoto?: boolean; certificates?: boolean }) =>
  (req: Request, _: Response, next: NextFunction) => {
    const files = req.files as TrainerMulterFiles;

    if (rules.profilePhoto && !files.profilePhoto?.length) {
      throw new ValidationError("Profile  photo is required");
    }

    if (rules.certificates && !files.certificates?.length) {
      throw new ValidationError("Certificates are required");
    }

    next();
  };
