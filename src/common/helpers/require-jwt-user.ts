import { Request } from "express";
import { JwtUser } from "../types/auth.types";
import { UnauthorizedError } from "../errors";

export function requireJwtUser(req: Request): JwtUser {
  if (!req.user?.id) {
    throw new UnauthorizedError("Unauthorized");
  }
  return req.user as JwtUser;
}
