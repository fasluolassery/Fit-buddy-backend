import { Document, Types } from "mongoose";

export interface IOtpDocument extends Document {
  _id: Types.ObjectId;
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}
