// import { QueryFilter, UpdateQuery } from "mongoose";
import { IUserDocument } from "../../entities/user.entity";
import IBaseRepository from "./base-repository.interface";

export default interface IUserRepository extends IBaseRepository<IUserDocument> {
  findUserByRole(role: "user" | "trainer"): Promise<IUserDocument[]>;
}
