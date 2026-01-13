import {
  DeleteResult,
  Document,
  QueryFilter,
  Types,
  UpdateQuery,
} from "mongoose";

export default interface IBaseRepository<T extends Document> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(filter: QueryFilter<T>): Promise<T | null>;
  findAll(filter: QueryFilter<T>): Promise<T[]>;
  updateOne(filter: QueryFilter<T>, update: UpdateQuery<T>): Promise<T | null>;
  updateById(id: Types.ObjectId, update: UpdateQuery<T>): Promise<T | null>;
  deleteById(id: Types.ObjectId): Promise<boolean>;
  deleteMany(filter: QueryFilter<T>): Promise<DeleteResult>;
}
