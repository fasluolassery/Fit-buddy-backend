import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { env } from "../config/env.config";
import { TokenPayload } from "../common/types/auth.types";
import { UnauthorizedError } from "../common/errors";

export const generateAccessToken = (payload: TokenPayload) =>
  jwt.sign(payload, env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });

export const generateRefreshToken = (payload: TokenPayload) =>
  jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as TokenPayload;
  } catch {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as TokenPayload;
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new UnauthorizedError("Access token expired");
    }

    if (err instanceof JsonWebTokenError) {
      throw new UnauthorizedError("Invalid access token");
    }

    throw new UnauthorizedError("Authentication failed");
  }
};
