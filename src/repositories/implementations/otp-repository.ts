import { inject, injectable } from "inversify";
import { IOtpDocument } from "../../entities/otp.entity";
import BaseRepository from "./base-repository";
import IOtpRepository from "../interfaces/otp-repository.interface";
import TYPES from "../../constants/types";
import { Model } from "mongoose";

@injectable()
export default class OtpRepository
  extends BaseRepository<IOtpDocument>
  implements IOtpRepository
{
  constructor(@inject(TYPES.otpModel) private _otpModel: Model<IOtpDocument>) {
    super(_otpModel);
  }

  async findValidOtp(
    email: string,
    code: string,
  ): Promise<IOtpDocument | null> {
    return this._otpModel.findOne({
      email,
      code,
      expiresAt: { $gt: new Date() },
    });
  }

  async deleteByEmail(email: string): Promise<void> {
    await this._otpModel.deleteMany({ email });
  }
}
