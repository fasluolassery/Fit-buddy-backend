import { inject, injectable } from "inversify";
import IUserRepository from "../../repositories/interfaces/user-repository.interface";
import IUserService from "../interfaces/user-service.interface";
import TYPES from "../../constants/types";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../common/errors";
import { UserDto } from "../../dto/user.dto";
import {
  TrainerOnboardingDTO,
  UserOnboardingDTO,
} from "../../validators/onboarding.validator";
import ITrainerRepository from "../../repositories/interfaces/trainer-repository.interface";

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
      throw new NotFoundError("User not found");
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

  async blockUser(userId: string): Promise<void> {
    const user = await this._userRepository.findById(userId);

    if (!user) throw new NotFoundError("User not found");
    if (user.role === "admin")
      throw new BadRequestError("Admin cannot be blocked");
    if (user.isBlocked) return;

    const { _id } = user;
    await this._userRepository.updateById(_id, {
      isBlocked: true,
    });
  }

  async unblockUser(userId: string): Promise<void> {
    const user = await this._userRepository.findById(userId);

    if (!user) throw new NotFoundError("User not found");
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

    if (!user) throw new NotFoundError("User not found");
    if (user.onboardingComplete) {
      throw new BadRequestError("User onboarding already completed");
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

    if (!updatedUser) throw new NotFoundError("User not found after update");

    const {
      name,
      role,
      email,
      profilePhoto,
      onboardingComplete,
      isVerified,
      isBlocked,
      trainerApprovalStatus,
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
    if (!user) throw new NotFoundError("User not found");

    if (user.role !== "trainer") {
      throw new ValidationError(
        "Only trainers can complete trainer onboarding",
      );
    }

    if (user.onboardingComplete)
      throw new ConflictError("Trainer onboarding already completed");

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
      createdAt,
    };
  }
}
