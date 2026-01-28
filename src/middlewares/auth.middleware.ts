import { Response, NextFunction, Request } from "express";
import { UnauthorizedError } from "../common/errors";
import { verifyAccessToken } from "../utils/jwt.util";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Access token missing");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      throw new UnauthorizedError("Access token missing");
    }

    const { id, role } = decoded;
    req.user = { id, role };

    next();
  } catch {
    throw new UnauthorizedError("Invalid or expired access token");
  }
};
