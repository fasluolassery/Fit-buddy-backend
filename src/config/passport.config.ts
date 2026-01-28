import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "./env.config";
import { decodeState } from "../utils/oauthState.util";
import { BadRequestError } from "../common/errors";
import { UserRole } from "../constants/roles.constant";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, _accessToken, _refreshToken, profile, done) => {
      try {
        const rawState = req.query.state as string;

        if (!rawState) {
          return done(new BadRequestError("Missing OAuth state"), undefined);
        }

        const { intent, role } = decodeState<{
          intent: "login" | "signup";
          role?: UserRole;
        }>(rawState);

        if (intent === "signup" && !role) {
          return done(
            new BadRequestError("Role required for signup"),
            undefined,
          );
        }

        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(
            new BadRequestError("Google account has no email"),
            undefined,
          );
        }

        const googleUser = {
          googleId: profile.id,
          email,
          name: profile.displayName,
          profilePhoto: profile.photos?.[0]?.value,
          intent,
          role: intent === "signup" ? role : undefined,
        };

        return done(null, googleUser);
      } catch (err) {
        done(err, undefined);
      }
    },
  ),
);

export default passport;
