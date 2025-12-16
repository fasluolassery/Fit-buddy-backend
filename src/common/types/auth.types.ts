import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface TokenPayload {
  id: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
