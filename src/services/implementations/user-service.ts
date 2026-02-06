import { inject, injectable } from "inversify";
import IUserRepository from "../../repositories/interfaces/user-repository.interface";
import IUserService from "../interfaces/user-service.interface";
import TYPES from "../../constants/types";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../common/errors";
import { AdminTrainerDto, UserDto } from "../../dto/user.dto";
import {
  TrainerOnboardingDTO,
  UserOnboardingDTO,
} from "../../validators/onboarding.validator";
import ITrainerRepository from "../../repositories/interfaces/trainer-repository.interface";
import {
  ADMIN_ERROR_MESSAGES,
  TRAINER_ERROR_MESSAGES,
  USER_ERROR_MESSAGES,
} from "../../constants/messages";

@injectable()
export default class UserService implements IUserService {
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.ITrainerRepository)
    private _trainerRepository: ITrainerRepository,
  ) {}

  async getMe(userId: string): Promise<UserDto> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(USER_ERROR_MESSAGES.NOT_FOUND);
    }

    const {
      _id,
      name,
      role,
      email,
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
      name,
      role,
      email,
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

  async getUsersForAdmin(): Promise<UserDto[]> {
    const users = await this._userRepository.findUserByRole("user");
    return users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      onboardingComplete: user.onboardingComplete,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
      profilePhoto: user.profilePhoto,
    }));
  }

  async getTrainersForAdmin(): Promise<AdminTrainerDto[]> {
    const trainerUsers = await this._userRepository.findUserByRole("trainer");

    const trainerProfiles = await this._trainerRepository.findByUserIds(
      trainerUsers.map((u) => u._id.toString()),
    );

    const trainerMap = new Map(
      trainerProfiles.map((t) => [t.userId.toString(), t]),
    );

    return trainerUsers.map((user) => {
      const trainer = trainerMap.get(user._id.toString());

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto ?? null,

        trainerApprovalStatus: user.trainerApprovalStatus,
        isVerified: user.isVerified,
        isBlocked: user.isBlocked,

        rating: trainer?.rating ?? 0,
        experienceYears: trainer?.experienceYears ?? "0",
        createdAt: user.createdAt,
      };
    });
  }

  async blockUser(userId: string): Promise<void> {
    const user = await this._userRepository.findById(userId);

    if (!user) throw new NotFoundError(USER_ERROR_MESSAGES.NOT_FOUND);
    if (user.role === "admin")
      throw new BadRequestError(USER_ERROR_MESSAGES.ADMIN_BLOCK_NOT_ALLOWED);
    if (user.isBlocked) return;

    const { _id } = user;
    await this._userRepository.updateById(_id, {
      isBlocked: true,
    });
  }

  async unblockUser(userId: string): Promise<void> {
    const user = await this._userRepository.findById(userId);

    if (!user) throw new NotFoundError(USER_ERROR_MESSAGES.NOT_FOUND);
    if (!user.isBlocked) return;

    const { _id } = user;
    await this._userRepository.updateById(_id, {
      isBlocked: false,
    });
  }

  async userOnboarding(
    userId: string,
    payload: UserOnboardingDTO,
  ): Promise<UserDto> {
    const user = await this._userRepository.findById(userId);

    if (!user) throw new NotFoundError(USER_ERROR_MESSAGES.NOT_FOUND);
    if (user.onboardingComplete) {
      throw new BadRequestError(USER_ERROR_MESSAGES.ALREADY_ONBOARDED);
    }

    const { _id } = user;

    const {
      primaryGoal,
      fitnessLevel,
      gender,
      age,
      height,
      weight,
      dietaryPreferences,
      equipments,
    } = payload;

    const updatedUser = await this._userRepository.updateById(_id, {
      primaryGoal,
      fitnessLevel,
      gender,
      age,
      height,
      weight,
      dietaryPreferences,
      equipments,
      onboardingComplete: true,
    });

    if (!updatedUser) throw new NotFoundError(USER_ERROR_MESSAGES.NOT_FOUND);

    const {
      name,
      role,
      email,
      profilePhoto,
      onboardingComplete,
      isVerified,
      isBlocked,
      trainerApprovalStatus,
      trainerRejectionReason,
      createdAt,
    } = updatedUser;

    return {
      _id,
      name,
      role,
      email,
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

  async trainerOnboarding(
    userId: string,
    payload: TrainerOnboardingDTO,
    profilePhoto: Express.Multer.File[],
    certificates: Express.Multer.File[],
  ): Promise<UserDto> {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new NotFoundError(USER_ERROR_MESSAGES.NOT_FOUND);

    if (user.role !== "trainer") {
      throw new BadRequestError(USER_ERROR_MESSAGES.TRAINER_ONLY_ACTION);
    }

    if (user.onboardingComplete)
      throw new ConflictError(
        TRAINER_ERROR_MESSAGES.ONBOARDING_ALREADY_COMPLETED,
      );

    const { _id } = user;
    const { bio, specializations, experience } = payload;

    const profilePhotoPath = profilePhoto[0].path;
    const certificatePaths = certificates.map((file) => file.path);

    await this._trainerRepository.create({
      userId: _id,
      bio,
      specializations,
      experienceYears: experience,
      certificates: certificatePaths,
    });

    user.profilePhoto = profilePhotoPath;
    user.trainerApprovalStatus = "pending";
    user.onboardingComplete = true;

    await user.save();

    const {
      name,
      role,
      email,
      profilePhoto: savedProfilePhoto,
      onboardingComplete,
      isVerified,
      isBlocked,
      trainerApprovalStatus,
      trainerRejectionReason,
      createdAt,
    } = user;

    return {
      _id,
      name,
      role,
      email,
      profilePhoto: savedProfilePhoto,
      onboardingComplete,
      isVerified,
      isBlocked,
      trainerApprovalStatus,
      trainerRejectionReason,
      createdAt,
    };
  }

  async approveTrainer(userId: string): Promise<void> {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new NotFoundError(USER_ERROR_MESSAGES.NOT_FOUND);

    if (user.role !== "trainer") {
      throw new BadRequestError(ADMIN_ERROR_MESSAGES.USER_NOT_TRAINER);
    }

    if (user.isBlocked) {
      throw new BadRequestError(
        TRAINER_ERROR_MESSAGES.BLOCKED_TRAINER_APPROVAL,
      );
    }

    if (user.trainerApprovalStatus === "approved") {
      return;
    }

    if (user.trainerApprovalStatus !== "pending") {
      throw new BadRequestError(TRAINER_ERROR_MESSAGES.INVALID_APPROVAL_STATE, {
        status: user.trainerApprovalStatus,
      });
    }

    const trainerProfile = await this._trainerRepository.findByUserId(
      user._id.toString(),
    );

    if (!trainerProfile) {
      throw new NotFoundError(TRAINER_ERROR_MESSAGES.PROFILE_NOT_FOUND);
    }

    await this._userRepository.updateById(user._id, {
      trainerApprovalStatus: "approved",
      trainerRejectionReason: null,
    });
  }

  async rejectTrainer(userId: string, reason: string): Promise<void> {
    if (!reason || reason.trim().length < 3) {
      throw new BadRequestError(
        TRAINER_ERROR_MESSAGES.REJECTION_REASON_REQUIRED,
      );
    }

    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(USER_ERROR_MESSAGES.NOT_FOUND);
    }

    if (user.role !== "trainer") {
      throw new BadRequestError(ADMIN_ERROR_MESSAGES.USER_NOT_TRAINER);
    }

    if (user.trainerApprovalStatus === "rejected") {
      return;
    }
    if (user.trainerApprovalStatus !== "pending") {
      throw new BadRequestError(
        TRAINER_ERROR_MESSAGES.INVALID_REJECTION_STATE,
        { status: user.trainerApprovalStatus },
      );
    }

    const trainerProfile = await this._trainerRepository.findByUserId(
      user._id.toString(),
    );

    if (!trainerProfile) {
      throw new NotFoundError(TRAINER_ERROR_MESSAGES.PROFILE_NOT_FOUND);
    }

    await this._userRepository.updateById(user._id, {
      trainerApprovalStatus: "rejected",
      trainerRejectionReason: reason,
    });
  }
}
