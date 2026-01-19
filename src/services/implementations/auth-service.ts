import { inject, injectable } from "inversify";
import IAuthService from "../interfaces/auth-service.interface";
import TYPES from "../../constants/types";
import IUserRepository from "../../repositories/interfaces/user-repository.interface";
import logger from "../../utils/logger.util";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  EmailNotVerifiedError,
} from "../../common/errors";
import { comparePassword, hashPassword } from "../../utils/password.util";
import {
  ForgotPasswordReqDto,
  GoogleLoginServiceResDto,
  GoogleUserPayload,
  LoginReqDto,
  LoginServiceResDto,
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
      throw new ConflictError("Email already registered");
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
    if (!record) throw new BadRequestError("Otp expired or invalid");

    if (record.expiresAt < new Date()) {
      await this._otpRepository.deleteMany({ email });
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

    await this._otpRepository.deleteMany({ email });

    return {
      email,
      isVerified: true,
    };
  }

  async login(data: LoginReqDto): Promise<LoginServiceResDto> {
    const { email, password, loginAs } = data;

    const user = await this._userRepository.findOne({ email });
    if (!user) throw new BadRequestError("Invalid credentials");

    if (loginAs === "admin" && user.role !== "admin") {
      throw new UnauthorizedError("Admin access only");
    }

    if (!user.isVerified) {
      throw new EmailNotVerifiedError();
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

  async refresh(refreshToken?: string): Promise<{ accessToken: string }> {
    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token missing");
    }

    const payload = verifyRefreshToken(refreshToken);
    const { id } = payload;

    const user = await this._userRepository.findById(id);
    if (!user || !user.isActive) {
      throw new UnauthorizedError("User not authorized");
    }

    if (!user.isVerified) {
      throw new UnauthorizedError("Email not verified");
    }

    const { _id, role } = user;

    const accessToken = generateAccessToken({
      id: _id.toString(),
      role,
    });

    return { accessToken };
  }

  async resendOtp(email: string): Promise<SignupResDto> {
    const user = await this._userRepository.findOne({ email });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.isVerified) {
      throw new BadRequestError("Email already verified");
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
      throw new UnauthorizedError("Invalid or expired reset link");
    }

    const { userId, _id } = resetRecord;

    const hashedPassword = await hashPassword(newPassword);

    await this._userRepository.updateById(userId, { password: hashedPassword });

    await this._passwordResetRepository.updateById(_id, { usedAt: new Date() });
  }

  private issueTokens(user: IUserDocument): GoogleLoginServiceResDto {
    const { _id, role } = user;

    const refreshToken = generateRefreshToken({
      id: _id.toString(),
      role,
    });

    return {
      refreshToken,
    };
  }

  async googleLogin(
    data: GoogleUserPayload,
  ): Promise<GoogleLoginServiceResDto> {
    const { email, googleId, name, intent, role } = data;

    if (!email || !googleId) {
      throw new BadRequestError("Invalid Google account data");
    }

    let user = await this._userRepository.findOne({ email });

    if (user) {
      if (!user.googleId) {
        throw new ConflictError(
          "Account exists with email/password. Use normal login.",
        );
      }

      if (user.googleId !== googleId) {
        throw new UnauthorizedError("Google account mismatch");
      }

      if (!user.isActive) {
        throw new UnauthorizedError("Account disabled");
      }

      return this.issueTokens(user);
    }

    if (intent !== "signup") {
      throw new UnauthorizedError("Account does not exist");
    }

    const allowedRoles: UserRole[] = ["user", "trainer"];
    if (!role || !allowedRoles.includes(role)) {
      throw new BadRequestError("Role required for signup");
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
