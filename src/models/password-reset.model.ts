import mongoose, { Schema, Types } from "mongoose";
import { IPasswordResetDocument } from "../entities/password-reset";

const passwordResetSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    tokenHash: {
      type: String,
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model<IPasswordResetDocument>(
  "Password-reset",
  passwordResetSchema,
);
