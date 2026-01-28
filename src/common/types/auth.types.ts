import { UserRole } from "../../constants/roles.constant";

export interface TokenPayload {
  id: string;
  role: UserRole;
}

export type JwtUser = {
  id: string;
  role: UserRole;
};

export type GoogleUserPayload = {
  googleId: string;
  email: string;
  name: string;
  profilePhoto?: string;
  intent: "login" | "signup";
  role?: UserRole;
};
