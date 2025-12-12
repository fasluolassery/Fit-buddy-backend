import { Document, Types } from "mongoose";

export interface IEquipmentItem {
  name: string;
  quantity?: number;
}

export interface IUserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: number;
  password: string;

  googleId?: string;
  profilePhoto?: string;
  role: "Admin" | "User" | "Trainer";

  primaryGoal: string;
  fitnessLevel?: string;
  gender: string;
  dob: Date;
  height: number;
  weight: number;
  dietaryPreferences?: string;
  equipments?: IEquipmentItem[];

  trainerId?: Types.ObjectId;
  planId?: Types.ObjectId;
  planExpiry?: Date;

  hasTrainer: boolean;
  planActive: boolean;
  onboardingComplete: boolean;

  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
