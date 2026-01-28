import { GoogleUserPayload } from "../../common/types/auth.types";
import {
  ForgotPasswordReqDto,
  GoogleLoginServiceResDto,
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
  forgotPassword(data: ForgotPasswordReqDto): Promise<void>;
  resetPassword(data: ResetPasswordReqDto): Promise<void>;
  googleLogin(data: GoogleUserPayload): Promise<GoogleLoginServiceResDto>;
}
