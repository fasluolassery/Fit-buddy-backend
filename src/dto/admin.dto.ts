import { Types } from "mongoose";

export interface AdminUserListDto {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: "user" | "trainer" | "admin";
  isVerified: boolean;
  isBlocked: boolean;
  profilePhoto?: string | null;
  createdAt: Date;
}

export interface AdminTrainerListDto {
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
