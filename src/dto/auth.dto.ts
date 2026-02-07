import { AuthUserDto } from "./user.dto";

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

export interface LoginResDto {
  accessToken: string;
  refreshToken: string;
  user: AuthUserDto;
}

export interface RefreshResDto {
  accessToken: string;
}

export interface ForgotPasswordReqDto {
  email: string;
}

export interface ResetPasswordReqDto {
  token: string;
  newPassword: string;
}

export interface GoogleLoginResDto {
  refreshToken: string;
}
