import mongoose, { Schema, Types } from "mongoose";
import { ITrainerDocument } from "../entities/trainer.entity";

const trainerSchema: Schema<ITrainerDocument> = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    bio: { type: String, required: true },
    specializations: { type: [String], required: true },
    experienceYears: { type: String, required: true },
    certificates: { type: [String], required: true },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model<ITrainerDocument>("Trainer", trainerSchema);
