import { Types } from "mongoose";

export interface UserDto {
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

export interface AdminTrainerDto {
  _id: Types.ObjectId;
  name: string;
  email: string;
  profilePhoto?: string | null;

  trainerApprovalStatus: "pending" | "approved" | "rejected";
  isVerified: boolean;
  isBlocked: boolean;

  rating: number;
  experienceYears: string;
  createdAt: Date;
}
