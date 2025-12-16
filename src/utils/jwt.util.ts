import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.config";
import { TokenPayload } from "../common/types/auth.types";

export const generateAccessToken = (payload: TokenPayload) =>
  jwt.sign(payload, env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });

export const generateRefreshToken = (payload: TokenPayload) =>
  jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

export const verifyRefreshToken = (token: string): JwtPayload =>
  jwt.verify(token, env.REFRESH_TOKEN_SECRET) as JwtPayload;

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;
  } catch {
    return null;
  }
};
