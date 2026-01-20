import { inject, injectable } from "inversify";
import IUserRepository from "../../repositories/interfaces/user-repository.interface";
import IUserService from "../interfaces/user-service.interface";
import TYPES from "../../constants/types";
import { NotFoundError } from "../../common/errors";
import { UserDto } from "../../dto/user.dto";

@injectable()
export default class UserService implements IUserService {
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
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
      isActive,
      status,
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
      isActive,
      status: role === "trainer" ? status : undefined,
      createdAt,
    };
  }
}
