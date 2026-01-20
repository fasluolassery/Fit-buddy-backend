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
    role: { type: String, required: true },

    primaryGoal: { type: String },
    fitnessLevel: { type: String },
    gender: { type: String },
    dob: { type: Date },
    height: { type: Number },
    weight: { type: Number },
    dietaryPreferences: { type: String },
    status: { type: String },
    equipments: {
      type: [{ name: { type: String }, quantity: { type: Number } }],
    },

    trainerId: { type: Types.ObjectId },
    planId: { type: Types.ObjectId },
    planExpiry: { type: Date },
    hasTrainer: { type: Boolean },
    planActive: { type: Boolean },
    onboardingComplete: { type: Boolean, default: false },

    isVerified: { type: Boolean },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model<IUserDocument>("User", userSchema);
