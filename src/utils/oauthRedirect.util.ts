import { Response } from "express";
import { env } from "../config/env.config";

export const redirectOAuthError = (
  res: Response,
  path: "/login" | "/signup",
  error: string,
) => {
  return res.redirect(`${env.FRONTEND_URL}${path}?error=${error}`);
};
