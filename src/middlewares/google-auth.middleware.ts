import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { UserRole } from "../constants/roles.constant";
import { encodeState } from "../utils/oauthState.util";
import { env } from "../config/env.config";
import { redirectOAuthError } from "../utils/oauthRedirect.util";

export const googleAuth = (req: Request, res: Response, next: NextFunction) => {
  const intent = req.query.intent as string;
  const role = req.query.role as string;

  if (!intent || !["login", "signup"].includes(intent)) {
    return redirectOAuthError(res, "/login", "INVALID_INTENT");
  }

  if (intent === "signup") {
    const allowedRoles: UserRole[] = ["user", "trainer"];

    if (!role || !allowedRoles.includes(role as UserRole)) {
      return redirectOAuthError(res, "/signup", "ROLE_REQUIRED");
    }
  }

  if (intent === "login" && role) {
    return redirectOAuthError(res, "/login", "INVALID_ROLE");
  }

  const options = {
    scope: ["profile", "email"],
    prompt: "select_account",
    state: encodeState({ intent, role }),
  };

  const middleware = passport.authenticate("google", options);
  middleware(req, res, next);
};

export const googleCallbackAuth = passport.authenticate("google", {
  session: false,
  failureRedirect: `${env.FRONTEND_URL}/login?error=GOOGLE_AUTH_FAILED`,
});
