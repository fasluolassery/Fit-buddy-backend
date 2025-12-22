import { Types } from "mongoose";

export interface MeServiceDto {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: string;
  profilePhoto?: string | null;
  onboardingComplete: boolean;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
}
