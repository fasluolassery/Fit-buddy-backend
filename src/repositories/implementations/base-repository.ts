import { Model, Document, QueryFilter, Types, UpdateQuery } from "mongoose";
import IBaseRepository from "../interfaces/base-repository.interface";
import logger from "../../utils/logger.util";

export default class BaseRepository<
  T extends Document,
> implements IBaseRepository<T> {
  constructor(private _model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    try {
      const doc = new this._model(data);
      return await doc.save();
    } catch (err) {
      logger.error("Error creating document:" + err);
      throw err;
    }
  }

  async findOne(filter: QueryFilter<T>): Promise<T | null> {
    try {
      return await this._model.findOne(filter);
    } catch (err) {
      logger.error("Error finding one:" + err);
      throw err;
    }
  }

  async findAll(filter: QueryFilter<T>): Promise<T[]> {
    try {
      return await this._model.find(filter);
    } catch (err) {
      logger.error("Error finding by id:" + err);
      throw err;
    }
  }

  async update(id: Types.ObjectId, data: UpdateQuery<T>): Promise<T | null> {
    try {
      return await this._model.findByIdAndUpdate(id, data, { new: true });
    } catch (err) {
      logger.error("Error updating document:" + err);
      throw err;
    }
  }

  async delete(id: Types.ObjectId): Promise<boolean> {
    try {
      const result = await this._model.findByIdAndDelete(id);
      return result !== null;
    } catch (err) {
      logger.error("Error deleting:" + err);
      throw err;
    }
  }
}
