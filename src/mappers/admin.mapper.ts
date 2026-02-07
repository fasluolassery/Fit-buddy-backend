import { AdminUserListDto } from "../dto/admin.dto";
import { ITrainerDocument } from "../entities/trainer.entity";
import { IUserDocument } from "../entities/user.entity";

export class AdminMapper {
  static toAdminUserDto(user: IUserDocument): AdminUserListDto {
    const {
      _id,
      name,
      email,
      role,
      isVerified,
      isBlocked,
      profilePhoto,
      createdAt,
    } = user;

    return {
      _id,
      name,
      email,
      role,
      isVerified,
      isBlocked,
      profilePhoto,
      createdAt,
    };
  }

  static toAdminTrainerDto(
    user: IUserDocument,
    trainerProfile?: ITrainerDocument,
  ) {
    const {
      _id,
      name,
      email,
      profilePhoto,
      trainerApprovalStatus,
      isVerified,
      isBlocked,
      createdAt,
    } = user;

    const rating = trainerProfile?.rating ?? 0;
    const experienceYears = trainerProfile?.experienceYears ?? "0";

    return {
      _id,
      name,
      email,
      profilePhoto,
      trainerApprovalStatus,
      isVerified,
      isBlocked,
      rating,
      experienceYears,
      createdAt,
    };
  }
}
