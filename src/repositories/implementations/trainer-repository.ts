import { inject, injectable } from "inversify";
import BaseRepository from "./base-repository";
import { ITrainerDocument } from "../../entities/trainer.entity";
import ITrainerRepository from "../interfaces/trainer-repository.interface";
import TYPES from "../../constants/types";
import { Model } from "mongoose";

@injectable()
export default class TrainerRepository
  extends BaseRepository<ITrainerDocument>
  implements ITrainerRepository
{
  constructor(
    @inject(TYPES.trainerModel) private _trainerModel: Model<ITrainerDocument>,
  ) {
    super(_trainerModel);
  }

  async findByUserId(userId: string): Promise<ITrainerDocument | null> {
    return this._trainerModel.findOne({ userId });
  }
}
