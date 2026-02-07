import { Types } from "mongoose";

export interface AuthUserDto {
  _id: Types.ObjectId;
  email: string;
  role: "user" | "trainer" | "admin";
  name?: string;
  profilePhoto?: string | null;
  onboardingComplete: boolean;
  isVerified: boolean;
  isBlocked: boolean;
  trainerApprovalStatus?: "pending" | "approved" | "rejected";
  trainerRejectionReason?: string | null;
  createdAt: Date;
}

export interface UserOnboardingReqDto {
  primaryGoal: string;
  fitnessLevel: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  dietaryPreferences?: string;
  equipments?: string[];
}
