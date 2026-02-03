import { ITrainerDocument } from "../../entities/trainer.entity";
import IBaseRepository from "./base-repository.interface";

export default interface ITrainerRepository extends IBaseRepository<ITrainerDocument> {
  findByUserId(userId: string): Promise<ITrainerDocument | null>;
}
