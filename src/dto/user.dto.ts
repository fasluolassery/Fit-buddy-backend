import { Types } from "mongoose";

export interface UserDto {
  _id: Types.ObjectId;
  email: string;
  role: "user" | "trainer" | "admin";
  name?: string;
  profilePhoto?: string | null;
  onboardingComplete: boolean;
  isVerified: boolean;
  isActive: boolean;
  status?: "active" | "pending" | "rejected";
  createdAt: Date;
}
