import { inject, injectable } from "inversify";
import IUserRepository from "../../repositories/interfaces/user-repository.interface";
import IUserService from "../interfaces/user-service.interface";
import TYPES from "../../constants/types";
import { BadRequestError, NotFoundError } from "../../common/errors";
import { USER_ERROR_MESSAGES } from "../../constants/messages";
import { AuthMapper } from "../../mappers/auth.mapper";
import { AuthUserDto, UserOnboardingReqDto } from "../../dto/user.dto";

@injectable()
export default class UserService implements IUserService {
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
  ) {}

  async userOnboarding(
    userId: string,
    payload: UserOnboardingReqDto,
  ): Promise<AuthUserDto> {
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

    return AuthMapper.toAuthUserDto(updatedUser);
  }
}
