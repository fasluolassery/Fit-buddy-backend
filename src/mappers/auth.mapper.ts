import { BadRequestError } from "../common/errors";
import { GoogleUserPayload } from "../common/types/auth.types";
import { AUTH_MESSAGES } from "../constants/messages";
import { UserRole } from "../constants/roles.constant";
import { SignupReqDto } from "../dto/auth.dto";
import { AuthUserDto } from "../dto/user.dto";
import { IUserDocument } from "../entities/user.entity";

export class AuthMapper {
  static toSignupDto(body: unknown): SignupReqDto {
    const data = body as SignupReqDto;

    return {
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone,
      password: data.password,
      role: this.mapRole(data.role),
    };
  }

  private static mapRole(role: string): SignupReqDto["role"] {
    switch (role) {
      case "user":
        return "user";
      case "trainer":
        return "trainer";
      default:
        return "user";
    }
  }

  static toGoogleLoginDto(user: unknown): GoogleUserPayload {
    if (!user || typeof user !== "object") {
      throw new BadRequestError(AUTH_MESSAGES.GOOGLE_INVALID_ACCOUNT_DATA);
    }

    const { googleId, email, name, profilePhoto, intent, role } =
      user as Partial<GoogleUserPayload>;

    if (!googleId || !email || !intent) {
      throw new BadRequestError(AUTH_MESSAGES.GOOGLE_INVALID_ACCOUNT_DATA);
    }

    if (intent !== "login" && intent !== "signup") {
      throw new BadRequestError(AUTH_MESSAGES.GOOGLE_INVALID_ACCOUNT_DATA);
    }

    return {
      googleId: googleId.trim(),
      email: email.toLowerCase().trim(),
      name: name?.trim() ?? "",
      profilePhoto,
      intent,
      role: intent === "signup" ? this.mapGoogleRole(role) : undefined,
    };
  }

  private static mapGoogleRole(role?: UserRole): UserRole | undefined {
    if (!role) return undefined;

    const allowedRoles: UserRole[] = ["user", "trainer"];

    if (!allowedRoles.includes(role)) {
      throw new BadRequestError(AUTH_MESSAGES.ROLE_REQUIRED_FOR_SIGNUP);
    }

    return role;
  }

  static toAuthUserDto(user: IUserDocument): AuthUserDto {
    const {
      _id,
      email,
      role,
      name,
      profilePhoto,
      onboardingComplete,
      isVerified,
      isBlocked,
      trainerApprovalStatus,
      trainerRejectionReason,
      createdAt,
    } = user;

    return {
      _id,
      email,
      role,
      name,
      profilePhoto,
      onboardingComplete,
      isVerified,
      isBlocked,
      trainerApprovalStatus:
        role === "trainer" ? trainerApprovalStatus : undefined,
      trainerRejectionReason,
      createdAt,
    };
  }
}
