import mongoose, { Schema } from "mongoose";
import { IOtpDocument } from "../entities/otp.entity";

const otpSchema: Schema<IOtpDocument> = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, expires: 120 },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model<IOtpDocument>("Otp", otpSchema);
