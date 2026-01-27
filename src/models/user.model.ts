import mongoose, { Schema, Types } from "mongoose";
import { IUserDocument } from "../entities/user.entity";

const userSchema: Schema<IUserDocument> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String },

    googleId: { type: String },
    profilePhoto: { type: String },
    role: { type: String, enum: ["user", "trainer", "admin"], required: true },

    primaryGoal: { type: String },
    fitnessLevel: { type: String },
    gender: { type: String },
    dob: { type: Date },
    height: { type: Number },
    weight: { type: Number },
    dietaryPreferences: { type: String },
    trainerApprovalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
    },
    equipments: {
      type: [{ name: { type: String }, quantity: { type: Number } }],
      default: undefined,
    },

    trainerId: { type: Types.ObjectId },
    planId: { type: Types.ObjectId },
    planExpiry: { type: Date },
    hasTrainer: { type: Boolean, default: false },
    planActive: { type: Boolean, default: false },
    onboardingComplete: { type: Boolean, default: false },

    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model<IUserDocument>("User", userSchema);
