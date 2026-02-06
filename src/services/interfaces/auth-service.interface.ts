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
import { UserDto } from "../../dto/user.dto";

export default interface IAuthService {
  signup(data: SignupReqDto): Promise<SignupResDto>;
  verifyOtp(data: VerifyOtpReqDto): Promise<VerifyOtpResDto>;
  login(data: LoginReqDto): Promise<LoginServiceResDto>;
  refresh(refreshToken: string): Promise<{ accessToken: string }>;
  getCurrentUser(userId: string): Promise<UserDto>;
  resendOtp(email: string): Promise<SignupResDto>;
  forgotPassword(data: ForgotPasswordReqDto): Promise<void>;
  resetPassword(data: ResetPasswordReqDto): Promise<void>;
  googleLogin(data: GoogleUserPayload): Promise<GoogleLoginServiceResDto>;
}
