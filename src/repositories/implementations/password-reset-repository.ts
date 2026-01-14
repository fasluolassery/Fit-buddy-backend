import { inject, injectable } from "inversify";
import { IPasswordResetDocument } from "../../entities/password-reset";
import BaseRepository from "./base-repository";
import TYPES from "../../constants/types";
import { Model } from "mongoose";
import IPasswordResetRepository from "../interfaces/password-reset-repository.interface";

@injectable()
export default class PasswordResetRepository
  extends BaseRepository<IPasswordResetDocument>
  implements IPasswordResetRepository
{
  constructor(
    @inject(TYPES.passwordResetModel)
    private _passwordResetModel: Model<IPasswordResetDocument>,
  ) {
    super(_passwordResetModel);
  }
}
