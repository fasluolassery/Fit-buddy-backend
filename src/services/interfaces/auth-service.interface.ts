import {
  LoginReqDto,
  LoginServiceResDto,
  ResetPasswordReqDto,
  SignupReqDto,
  SignupResDto,
  VerifyOtpReqDto,
  VerifyOtpResDto,
} from "../../dto/auth.dto";

export default interface IAuthService {
  signup(data: SignupReqDto): Promise<SignupResDto>;
  verifyOtp(data: VerifyOtpReqDto): Promise<VerifyOtpResDto>;
  login(data: LoginReqDto): Promise<LoginServiceResDto>;
  refresh(refreshToken: string): Promise<{ accessToken: string }>;
  resendOtp(email: string): Promise<SignupResDto>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(data: ResetPasswordReqDto): Promise<void>;
}
