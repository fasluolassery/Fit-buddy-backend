import { Response, NextFunction, Request } from "express";
import { UnauthorizedError } from "../common/errors";
import { verifyAccessToken } from "../utils/jwt.util";
import container from "../config/inversify.config";
import IUserRepository from "../repositories/interfaces/user-repository.interface";
import TYPES from "../constants/types";
import { ForbiddenError } from "../common/errors/forbidden.error";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Access token missing");
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyAccessToken(token);

  const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
  const { id } = decoded;
  const user = await userRepository.findById(id);

  if (!user) throw new UnauthorizedError("User not found");
  if (user.isBlocked) throw new ForbiddenError("Account is blocked");

  const { _id, role } = user;
  req.user = { id: _id.toString(), role };

  next();
};
