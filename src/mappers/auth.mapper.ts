import { AuthUserDto } from "../dto/user.dto";
import { IUserDocument } from "../entities/user.entity";

export class AuthMapper {
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
