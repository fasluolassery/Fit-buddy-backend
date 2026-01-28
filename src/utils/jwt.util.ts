import jwt from "jsonwebtoken";
import { env } from "../config/env.config";
import { TokenPayload } from "../common/types/auth.types";

export const generateAccessToken = (payload: TokenPayload) =>
  jwt.sign(payload, env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });

export const generateRefreshToken = (payload: TokenPayload) =>
  jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

export const verifyRefreshToken = (token: string): TokenPayload =>
  jwt.verify(token, env.REFRESH_TOKEN_SECRET) as TokenPayload;

export const verifyAccessToken = (token: string): TokenPayload =>
  jwt.verify(token, env.ACCESS_TOKEN_SECRET) as TokenPayload;
