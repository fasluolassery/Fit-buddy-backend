import { Model, Document, QueryFilter, UpdateQuery, Types } from "mongoose";
import IBaseRepository from "../interfaces/base-repository.interface";

export default class BaseRepository<
  T extends Document,
> implements IBaseRepository<T> {
  constructor(private _model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const doc = new this._model(data);
    return doc.save();
  }

  async findById(id: string): Promise<T | null> {
    return this._model.findById(id);
  }

  async findOne(filter: QueryFilter<T>): Promise<T | null> {
    return this._model.findOne(filter);
  }

  async findAll(filter: QueryFilter<T>): Promise<T[]> {
    return this._model.find(filter);
  }

  updateOne(filter: QueryFilter<T>, update: UpdateQuery<T>): Promise<T | null> {
    return this._model.findOneAndUpdate(filter, update, { new: true });
  }

  async updateById(
    id: Types.ObjectId,
    update: UpdateQuery<T>,
  ): Promise<T | null> {
    return this._model.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id: Types.ObjectId): Promise<boolean> {
    const result = await this._model.findByIdAndDelete(id);
    return result !== null;
  }
}
