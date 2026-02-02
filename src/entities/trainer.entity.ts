import { Document, Types } from "mongoose";

export interface ITrainerDocument extends Document {
  userId: Types.ObjectId;
  bio: string;
  specializations: string[];
  experienceYears: string;
  certificates: string[];
  rating: number;
  reviewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}
