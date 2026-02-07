import { GoogleUserPayload } from "../../common/types/auth.types";
import {
  ForgotPasswordReqDto,
  GoogleLoginResDto,
  LoginReqDto,
  LoginResDto,
  RefreshResDto,
  ResetPasswordReqDto,
  SignupReqDto,
  SignupResDto,
  VerifyOtpReqDto,
  VerifyOtpResDto,
} from "../../dto/auth.dto";
import { AuthUserDto } from "../../dto/user.dto";

export default interface IAuthService {
  signup(data: SignupReqDto): Promise<SignupResDto>;
  verifyOtp(data: VerifyOtpReqDto): Promise<VerifyOtpResDto>;
  login(data: LoginReqDto): Promise<LoginResDto>;
  refresh(refreshToken: string): Promise<RefreshResDto>;
  getCurrentUser(userId: string): Promise<AuthUserDto>;
  resendOtp(email: string): Promise<SignupResDto>;
  forgotPassword(data: ForgotPasswordReqDto): Promise<void>;
  resetPassword(data: ResetPasswordReqDto): Promise<void>;
  googleLogin(data: GoogleUserPayload): Promise<GoogleLoginResDto>;
}
