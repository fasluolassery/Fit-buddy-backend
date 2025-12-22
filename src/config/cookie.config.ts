import { CookieOptions } from "express";
import { env } from "./env.config";

export const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: env.REFRESH_TOKEN_MAX_AGE,
};
