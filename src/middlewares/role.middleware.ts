import { Response, NextFunction } from "express";
import { AuthRequest } from "../common/types/auth.types";
import { UserRole } from "../constants/roles.constant";
import { UnauthorizedError } from "../common/errors";
import { ForbiddenError } from "../common/errors/forbidden.error";

export const requireRole =
  (...allowedRoles: UserRole[]) =>
  (req: AuthRequest, _: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError("Unauthorized");
    }

    const { role } = req.user;

    if (!allowedRoles.includes(role)) {
      throw new ForbiddenError("Access denied");
    }

    next();
  };
