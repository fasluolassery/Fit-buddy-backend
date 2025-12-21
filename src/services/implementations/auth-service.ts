import { inject, injectable } from "inversify";
import IAuthService from "../interfaces/auth-service.interface";
import TYPES from "../../constants/types";
import IUserRepository from "../../repositories/interfaces/user-repository.interface";
import logger from "../../utils/logger.util";
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from "../../common/errors";
import { comparePassword, hashPassword } from "../../utils/password.util";
import {
  LoginReqDto,
  LoginServiceResDto,
  SignupReqDto,
  SignupResDto,
  VerifyOtpReqDto,
  VerifyOtpResDto,
} from "../../dto/auth.dto";
import { generateOtp } from "../../utils/otp.util";
import IOtpRepository from "../../repositories/interfaces/otp-repository.interface";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt.util";
import { InternalServerError } from "../../common/errors/internal-server.error";
// import { sendOtpMail } from "../../utils/mail.util";

@injectable()
export default class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.IOtpRepository) private _otpRepository: IOtpRepository,
  ) {}

  async signup(data: SignupReqDto): Promise<SignupResDto> {
    const { email, password } = data;

    const existing = await this._userRepository.findOne({ email });
    if (existing) {
      throw new ConflictError("Email already registered");
    }

    const hashedPassword = await hashPassword(password);

    await this._userRepository.create({
      ...data,
      password: hashedPassword,
      isVerified: false,
    });

    const otp = generateOtp();

    await this._otpRepository.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // await sendOtpMail(email, otp);
    logger.warn("OTP: " + otp);

    return { email };
  }

  async verifyOtp(data: VerifyOtpReqDto): Promise<VerifyOtpResDto> {
    const { email, otp } = data;

    const record = await this._otpRepository.findOne({ email, otp });
    if (!record) throw new BadRequestError("Otp not found");

    if (record.expiresAt < new Date()) {
      throw new BadRequestError("Otp expired");
    }

    if (record.otp !== otp) {
      throw new BadRequestError("Invalid Otp");
    }

    const userRecord = await this._userRepository.updateOne(
      { email },
      { isVerified: true },
    );

    if (!userRecord) {
      throw new InternalServerError("User not found after OTP verification", {
        email,
      });
    }

    return {
      email,
      isVerified: true,
    };
  }

  async login(data: LoginReqDto): Promise<LoginServiceResDto> {
    const { email, password } = data;

    const user = await this._userRepository.findOne({ email });
    if (!user) throw new BadRequestError("Invalid credentials");

    if (!user.isVerified) {
      throw new UnauthorizedError("Email not verified");
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const { _id, role } = user;

    const accessToken = generateAccessToken({
      id: _id.toString(),
      role,
    });

    const refreshToken = generateRefreshToken({
      id: _id.toString(),
      role,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        _id,
        email,
        role,
      },
    };
  }
}
