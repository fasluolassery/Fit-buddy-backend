import { inject, injectable } from "inversify";
import IUserRepository from "../../repositories/interfaces/user-repository.interface";
import IUserService from "../interfaces/user-service.interface";
import TYPES from "../../constants/types";
import { BadRequestError, NotFoundError } from "../../common/errors";
import { UserDto } from "../../dto/user.dto";
import { UserOnboardingDTO } from "../../validators/onboarding.validator";
import ITrainerRepository from "../../repositories/interfaces/trainer-repository.interface";
import { USER_ERROR_MESSAGES } from "../../constants/messages";

@injectable()
export default class UserService implements IUserService {
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.ITrainerRepository)
    private _trainerRepository: ITrainerRepository,
  ) {}

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
}
