import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.config";
import { Response, NextFunction } from "express";
import { UnauthorizedError } from "../common/errors";
import { AuthRequest } from "../common/types/auth.types";

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthorizedError("Access token missing");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    throw new UnauthorizedError("Invalid or expired access token");
  }
};
