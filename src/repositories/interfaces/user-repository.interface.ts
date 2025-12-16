// import { QueryFilter, UpdateQuery } from "mongoose";
import { IUserDocument } from "../../entities/user.entity";
import IBaseRepository from "./base-repository.interface";

/* eslint-disable @typescript-eslint/no-empty-object-type */
export default interface IUserRepository extends IBaseRepository<IUserDocument> {}
