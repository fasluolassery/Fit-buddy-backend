import { injectable, inject } from "inversify";
import { IUserDocument } from "../../entities/user.entity";
import IUserRepository from "../interfaces/user-repository.interface";
import BaseRepository from "./base-repository";
import TYPES from "../../constants/types";
import { Model } from "mongoose";

@injectable()
export default class UserRepository
  extends BaseRepository<IUserDocument>
  implements IUserRepository
{
  constructor(
    @inject(TYPES.userModel) private _userModel: Model<IUserDocument>,
  ) {
    super(_userModel);
  }

  async findUserByRole(role: "user" | "trainer"): Promise<IUserDocument[]> {
    return this._userModel.find({ role }).sort({ createdAt: -1 });
  }
}
