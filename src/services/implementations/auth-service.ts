import { inject, injectable } from "inversify";
import IAuthService from "../interfaces/auth-service.interface";
import TYPES from "../../constants/types";
import IUserRepository from "../../repositories/interfaces/user-repository.interface";
import { IUserDocument } from "../../entities/user.entity";

@injectable()
export default class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
  ) {}

  async signup(data: Partial<IUserDocument>): Promise<Partial<IUserDocument>> {
    const res = await this._userRepository.create(data);
    return res;
  }
}
