import { inject, injectable } from "inversify";
import IAuthService from "../interfaces/auth-service.interface";
import TYPES from "../../constants/types";
import IUserRepository from "../../repositories/interfaces/user-repository.interface";
import logger from "../../utils/logger.util";
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  EmailNotVerifiedError,
  NotFoundError,
} from "../../common/errors";
import { comparePassword, hashPassword } from "../../utils/password.util";
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
import { generateOtp } from "../../utils/otp.util";
import IOtpRepository from "../../repositories/interfaces/otp-repository.interface";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.util";
import { InternalServerError } from "../../common/errors/internal-server.error";
import { sendOtpMail, sendResetPasswordLink } from "../../utils/mail.util";
import { generateResetToken, hashToken } from "../../utils/token.util";
import IPasswordResetRepository from "../../repositories/interfaces/password-reset-repository.interface";
import { env } from "../../config/env.config";
import { UserRole } from "../../constants/roles.constant";
import { IUserDocument } from "../../entities/user.entity";
import { GoogleUserPayload } from "../../common/types/auth.types";
import { AUTH_MESSAGES, COMMON_MESSAGES } from "../../constants/messages";
import { AuthUserDto } from "../../dto/user.dto";
import { AuthMapper } from "../../mappers/auth.mapper";

@injectable()
export default class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.IOtpRepository) private _otpRepository: IOtpRepository,
    @inject(TYPES.IPasswordResetRepository)
    private _passwordResetRepository: IPasswordResetRepository,
  ) {}

  async signup(data: SignupReqDto): Promise<SignupResDto> {
    const { email, password } = data;

    const existing = await this._userRepository.findOne({ email });
    if (existing) {
      throw new ConflictError(AUTH_MESSAGES.EMAIL_ALREADY_REGISTERED);
    }

    const hashedPassword = await hashPassword(password);

    await this._userRepository.create({
      ...data,
      password: hashedPassword,
      isVerified: false,
    });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await this._otpRepository.create({
      email,
      otp,
      expiresAt,
    });

    await sendOtpMail(email, otp);
    logger.warn("OTP: " + otp);

    return { email };
  }

  async verifyOtp(data: VerifyOtpReqDto): Promise<VerifyOtpResDto> {
    const { email, otp } = data;

    const record = await this._otpRepository.findOne({ email });
    if (!record)
      throw new BadRequestError(AUTH_MESSAGES.OTP_EXPIRED_OR_INVALID);

    if (record.expiresAt < new Date()) {
      await this._otpRepository.deleteMany({ email });
      throw new BadRequestError(AUTH_MESSAGES.OTP_EXPIRED_OR_INVALID);
    }

    if (record.otp !== otp) {
      throw new BadRequestError(AUTH_MESSAGES.OTP_EXPIRED_OR_INVALID);
    }

    const userRecord = await this._userRepository.updateOne(
      { email },
      { isVerified: true },
    );

    if (!userRecord) {
      logger.error(`OTP verified but user update failed for ${email}`);

      throw new InternalServerError(COMMON_MESSAGES.INTERNAL_SERVER_ERROR, {
        email,
      });
    }

    await this._otpRepository.deleteMany({ email });

    return {
      email,
      isVerified: true,
    };
  }

  async login(data: LoginReqDto): Promise<LoginResDto> {
    const { email, password, loginAs } = data;

    const user = await this._userRepository.findOne({ email });
    if (!user) throw new UnauthorizedError(AUTH_MESSAGES.INVALID_CREDENTIALS);

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_CREDENTIALS);

    if (!user.isVerified) throw new EmailNotVerifiedError();
    if (user.isBlocked)
      throw new UnauthorizedError(AUTH_MESSAGES.ACCOUNT_BLOCKED);

    if (loginAs === "admin" && user.role !== "admin") {
      throw new UnauthorizedError(AUTH_MESSAGES.ADMIN_ONLY);
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

    const authUserDto = AuthMapper.toAuthUserDto(user);

    return {
      accessToken,
      refreshToken,
      user: authUserDto,
    };
  }

  async refresh(refreshToken?: string): Promise<RefreshResDto> {
    if (!refreshToken) {
      throw new UnauthorizedError(AUTH_MESSAGES.REFRESH_TOKEN_MISSING);
    }

    const payload = verifyRefreshToken(refreshToken);
    const { id } = payload;

    const user = await this._userRepository.findById(id);
    if (!user || user.isBlocked) {
      throw new UnauthorizedError(AUTH_MESSAGES.USER_NOT_AUTHORIZED);
    }

    if (!user.isVerified) {
      throw new UnauthorizedError(AUTH_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    const { _id, role } = user;

    const accessToken = generateAccessToken({
      id: _id.toString(),
      role,
    });

    return { accessToken };
  }

  async getCurrentUser(userId: string): Promise<AuthUserDto> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    return AuthMapper.toAuthUserDto(user);
  }

  async resendOtp(email: string): Promise<SignupResDto> {
    const user = await this._userRepository.findOne({ email });

    if (!user) {
      return { email };
    }

    if (user.isVerified) {
      throw new BadRequestError(AUTH_MESSAGES.EMAIL_ALREADY_VERIFIED);
    }

    await this._otpRepository.deleteMany({ email });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await this._otpRepository.create({
      email,
      otp,
      expiresAt,
    });

    await sendOtpMail(email, otp);
    logger.warn("OTP: " + otp);

    return { email };
  }

  async forgotPassword(data: ForgotPasswordReqDto): Promise<void> {
    const { email } = data;

    const user = await this._userRepository.findOne({ email });
    if (!user) return;

    const { _id } = user;
    const { rawToken, tokenHash } = generateResetToken();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await this._passwordResetRepository.create({
      userId: _id,
      tokenHash,
      expiresAt,
    });

    const resetLink = `${env.FRONTEND_URL}/reset-password?token=${rawToken}`;
    logger.info("Reset Link" + resetLink);

    await sendResetPasswordLink(email, resetLink, 5);
    logger.info(`password reset link sent to ${email}`);
  }

  async resetPassword(data: ResetPasswordReqDto): Promise<void> {
    const { token, newPassword } = data;

    const tokenHash = hashToken(token);
    const resetRecord = await this._passwordResetRepository.findOne({
      tokenHash,
      usedAt: null,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      throw new UnauthorizedError(AUTH_MESSAGES.RESET_LINK_INVALID);
    }

    const { userId, _id } = resetRecord;
    const hashedPassword = await hashPassword(newPassword);

    await this._userRepository.updateById(userId, { password: hashedPassword });
    await this._passwordResetRepository.updateById(_id, { usedAt: new Date() });
  }

  private issueTokens(user: IUserDocument): GoogleLoginResDto {
    const { _id, role } = user;

    const refreshToken = generateRefreshToken({
      id: _id.toString(),
      role,
    });

    return {
      refreshToken,
    };
  }

  async googleLogin(data: GoogleUserPayload): Promise<GoogleLoginResDto> {
    const { email, googleId, name, intent, role } = data;

    if (!email || !googleId) {
      throw new BadRequestError(AUTH_MESSAGES.GOOGLE_INVALID_ACCOUNT_DATA);
    }

    let user = await this._userRepository.findOne({ email });

    if (user) {
      if (!user.googleId) {
        throw new ConflictError(AUTH_MESSAGES.GOOGLE_PASSWORD_CONFLICT);
      }

      if (user.googleId !== googleId) {
        throw new UnauthorizedError(AUTH_MESSAGES.GOOGLE_ACCOUNT_MISMATCH);
      }

      if (user.isBlocked) {
        throw new UnauthorizedError(AUTH_MESSAGES.GOOGLE_ACCOUNT_DISABLED);
      }

      return this.issueTokens(user);
    }

    if (intent !== "signup") {
      throw new UnauthorizedError(AUTH_MESSAGES.GOOGLE_ACCOUNT_NOT_FOUND);
    }

    const allowedRoles: UserRole[] = ["user", "trainer"];
    if (!role || !allowedRoles.includes(role)) {
      throw new BadRequestError(AUTH_MESSAGES.ROLE_REQUIRED_FOR_SIGNUP);
    }

    const newUser = await this._userRepository.create({
      email,
      name,
      googleId,
      role,
      isVerified: true,
    });

    return this.issueTokens(newUser);
  }
}
