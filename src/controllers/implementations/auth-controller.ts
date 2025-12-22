import { inject, injectable } from "inversify";
import IAuthController from "../interfaces/auth-controller.interface";
import TYPES from "../../constants/types";
import IAuthService from "../../services/interfaces/auth-service.interface";
import { Request, Response } from "express";
import logger from "../../utils/logger.util";
import { HttpStatus } from "../../constants/http-status.constant";
import { LoginReqDto, SignupReqDto, VerifyOtpReqDto } from "../../dto/auth.dto";
import { refreshTokenCookieOptions } from "../../config/cookie.config";

@injectable()
export default class AuthController implements IAuthController {
  constructor(@inject(TYPES.IAuthService) private _authService: IAuthService) {}

  async signup(req: Request, res: Response): Promise<void> {
    const dto: SignupReqDto = req.body;
    logger.info(`Data: ${dto.email}`);

    const data = await this._authService.signup(dto);

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: "Signup successful. OTP sent to email.",
      data,
    });
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    logger.info(`Data: ${JSON.stringify(req.body)}`);

    const dto: VerifyOtpReqDto = req.body;
    const data = await this._authService.verifyOtp(dto);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Email verified successfully",
      data,
    });
  }

  async login(req: Request, res: Response): Promise<void> {
    logger.info(`Data: ${JSON.stringify(req.body)}`);

    const dto: LoginReqDto = req.body;
    const data = await this._authService.login(dto);
    const { accessToken, refreshToken, user } = data;

    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        user,
      },
    });
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refreshToken;

    const data = await this._authService.refresh(refreshToken);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Token refreshed successfully",
      data,
    });
  }

  async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie("refreshToken", refreshTokenCookieOptions);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Logged out successfully",
    });
  }
}
