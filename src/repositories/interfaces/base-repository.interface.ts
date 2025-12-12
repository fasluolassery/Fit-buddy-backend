import { Document, QueryFilter, Types, UpdateQuery } from "mongoose";

export default interface IBaseRepository<T extends Document> {
  create(data: Partial<T>): Promise<T>;
  findOne(filter: QueryFilter<T>): Promise<T | null>;
  findAll(filter: QueryFilter<T>): Promise<T[]>;
  update(id: Types.ObjectId, data: UpdateQuery<T>): Promise<T | null>;
  delete(id: Types.ObjectId): Promise<boolean>;
}
