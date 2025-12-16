import {
  LoginReqDto,
  LoginServiceResDto,
  SignupReqDto,
  SignupResDto,
  VerifyOtpReqDto,
} from "../../dto/auth.dto";

export default interface IAuthService {
  signup(data: SignupReqDto): Promise<SignupResDto>;
  verifyOtp(data: VerifyOtpReqDto): Promise<void>;
  login(data: LoginReqDto): Promise<LoginServiceResDto>;
}
