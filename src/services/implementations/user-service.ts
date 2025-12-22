import { inject, injectable } from "inversify";
import IUserRepository from "../../repositories/interfaces/user-repository.interface";
import IUserService from "../interfaces/user-service.interface";
import TYPES from "../../constants/types";
import { NotFoundError } from "../../common/errors";
import { MeServiceDto } from "../../dto/user.dto";

@injectable()
export default class UserService implements IUserService {
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
  ) {}

  async getMe(userId: string): Promise<MeServiceDto> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const {
      _id,
      name,
      email,
      role,
      profilePhoto,
      onboardingComplete,
      isVerified,
      isActive,
      createdAt,
    } = user;

    return {
      _id,
      name,
      email,
      role,
      profilePhoto,
      onboardingComplete,
      isVerified,
      isActive,
      createdAt,
    };
  }
}
