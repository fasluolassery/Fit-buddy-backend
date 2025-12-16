import { IOtpDocument } from "../../entities/otp.entity";
import IBaseRepository from "./base-repository.interface";

export default interface IOtpRepository extends IBaseRepository<IOtpDocument> {
  findValidOtp(email: string, code: string): Promise<IOtpDocument | null>;
  deleteByEmail(email: string): Promise<void>;
}
