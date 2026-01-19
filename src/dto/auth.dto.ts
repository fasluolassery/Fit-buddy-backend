import { Types } from "mongoose";

export interface SignupReqDto {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "user" | "trainer" | "admin";
}

export interface SignupResDto {
  email: string;
}

export interface VerifyOtpReqDto {
  email: string;
  otp: string;
}

export interface VerifyOtpResDto {
  email: string;
  isVerified: boolean;
}

export interface LoginReqDto {
  email: string;
  password: string;
  loginAs?: "user" | "admin";
}

export interface LoginServiceResDto {
  accessToken: string;
  refreshToken: string;
  user: {
    _id: Types.ObjectId;
    email: string;
    role: string;
  };
}

export interface ForgotPasswordReqDto {
  email: string;
}

export interface ResetPasswordReqDto {
  token: string;
  newPassword: string;
}

export interface GoogleUserPayload {
  googleId: string;
  email: string;
  name: string;
  intent: "signup" | "login";
  role: "user" | "trainer";
}

export interface GoogleLoginServiceResDto {
  refreshToken: string;
}
