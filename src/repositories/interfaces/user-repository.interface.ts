import { IUserDocument } from "../../entities/user.entity";
import IBaseRepository from "./base-repository.interface";

export default interface IUserRepository extends IBaseRepository<IUserDocument> {
  // findByMail(email: string): Promise<IUserDocument | null>;
  create(data: Partial<IUserDocument>): Promise<IUserDocument>;
}
