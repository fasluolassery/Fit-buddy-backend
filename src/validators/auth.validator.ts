import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "trainer", "admin"]),
});

export const verifyOtpSchema = z.object({
  email: z.email("Invalid email address"),
  otp: z.string().length(6, "Otp must be 6 numbers"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const resendOtpSchema = z.object({
  email: z.email("Invalid email address"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});
