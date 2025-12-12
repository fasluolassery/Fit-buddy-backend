import mongoose from "mongoose";
import logger from "../utils/logger.util";
import { env } from "./env.config";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI as string);
    logger.info("MongoDB connected:)");
  } catch (err) {
    logger.error("MongoDB connection error: " + (err as Error).message);
    process.exit(1);
  }
};
