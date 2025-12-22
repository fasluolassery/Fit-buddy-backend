import { Request } from "express";
import { UserRole } from "../../constants/roles.constant";

export interface TokenPayload {
  id: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}
