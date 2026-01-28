import { GoogleUserPayload, JwtUser } from "./auth.types";

declare global {
  namespace Express {
    interface User extends Partial<JwtUser>, Partial<GoogleUserPayload> {}
  }
}
