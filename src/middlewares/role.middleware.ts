import { Response, NextFunction, Request } from "express";
import { UserRole } from "../constants/roles.constant";
import { UnauthorizedError } from "../common/errors";
import { ForbiddenError } from "../common/errors/forbidden.error";

export const requireRole =
  (...allowedRoles: UserRole[]) =>
  (req: Request, _: Response, next: NextFunction) => {
    if (!req.user?.role) {
      throw new UnauthorizedError("Unauthorized");
    }

    const { role } = req.user;
    if (!allowedRoles.includes(role)) {
      throw new ForbiddenError("Access denied");
    }

    next();
  };
