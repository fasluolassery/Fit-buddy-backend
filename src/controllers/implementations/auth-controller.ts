import { inject, injectable } from "inversify";
import IAuthController from "../interfaces/auth-controller.interface";
import TYPES from "../../constants/types";
import IAuthService from "../../services/interfaces/auth-service.interface";
import { Request, Response } from "express";
import logger from "../../utils/logger.util";
import { HttpStatus } from "../../constants/http-status.constant";
import {
  ForgotPasswordReqDto,
  LoginReqDto,
  ResetPasswordReqDto,
  VerifyOtpReqDto,
} from "../../dto/auth.dto";
import { refreshTokenCookieOptions } from "../../config/cookie.config";
import { env } from "../../config/env.config";
import { mapGoogleAuthError } from "../helpers/map-google-auth-error";
import { redirectOAuthError } from "../../utils/oauthRedirect.util";
import { AUTH_MESSAGES } from "../../constants/messages";
import { requireJwtUser } from "../../common/helpers/require-jwt-user";
import { AuthMapper } from "../../mappers/auth.mapper";

@injectable()
export default class AuthController implements IAuthController {
  constructor(@inject(TYPES.IAuthService) private _authService: IAuthService) {}

  async signup(req: Request, res: Response): Promise<void> {
    const signupDto = AuthMapper.toSignupDto(req.body);
    logger.info(`Data: ${signupDto.email}`);

    const data = await this._authService.signup(signupDto);

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: AUTH_MESSAGES.SIGNUP_SUCCESS_OTP_SENT,
      data,
    });
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    logger.info(`Data: ${JSON.stringify(req.body)}`);

    const dto: VerifyOtpReqDto = req.body;
    const data = await this._authService.verifyOtp(dto);

    res.status(HttpStatus.OK).json({
      success: true,
      message: AUTH_MESSAGES.EMAIL_VERIFIED_SUCCESS,
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
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
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
      message: AUTH_MESSAGES.TOKEN_REFRESH_SUCCESS,
      data,
    });
  }

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    const { id } = requireJwtUser(req);

    const data = await this._authService.getCurrentUser(id);

    res.status(HttpStatus.OK).json({
      success: true,
      message: AUTH_MESSAGES.CURRENT_USER_FETCHED,
      data,
    });
  }

  async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie("refreshToken", refreshTokenCookieOptions);

    res.status(HttpStatus.OK).json({
      success: true,
      message: AUTH_MESSAGES.LOGOUT_SUCCESS,
    });
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    const data = await this._authService.resendOtp(email);

    res.status(HttpStatus.OK).json({
      success: true,
      message: AUTH_MESSAGES.OTP_RESENT_SUCCESS,
      data,
    });
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const dto: ForgotPasswordReqDto = req.body;
    await this._authService.forgotPassword(dto);

    res.status(HttpStatus.OK).json({
      success: true,
      message: AUTH_MESSAGES.PASSWORD_RESET_LINK_SENT,
    });
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const dto: ResetPasswordReqDto = req.body;

    await this._authService.resetPassword(dto);

    res.status(HttpStatus.OK).json({
      success: true,
      message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS,
    });
  }

  async googleCallback(req: Request, res: Response): Promise<void> {
    try {
      const googleDto = AuthMapper.toGoogleLoginDto(req.user);

      const { refreshToken } = await this._authService.googleLogin(googleDto);
      res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

      res.redirect(`${env.FRONTEND_URL}/redirect`);
    } catch (err) {
      const code = mapGoogleAuthError(err);
      return redirectOAuthError(res, "/login", code);
    }
  }
}
