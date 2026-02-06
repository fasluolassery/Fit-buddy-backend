import { Request, Response } from "express";
import IUserController from "../interfaces/user-controller.interface";
import { inject } from "inversify";
import TYPES from "../../constants/types";
import IUserService from "../../services/interfaces/user-service.interface";
import { HttpStatus } from "../../constants/http-status.constant";
import { requireJwtUser } from "../../common/helpers/require-jwt-user";
import { TrainerMulterFiles } from "../../middlewares/validate-files.middleware";
import { TrainerOnboardingDTO } from "../../validators/onboarding.validator";
import {
  ADMIN_MESSAGES,
  TRAINER_MESSAGES,
  USER_MESSAGES,
} from "../../constants/messages";

export default class UserController implements IUserController {
  constructor(@inject(TYPES.IUserService) private _userService: IUserService) {}

  async me(req: Request, res: Response): Promise<void> {
    const { id } = requireJwtUser(req);

    const data = await this._userService.getMe(id);

    res.status(HttpStatus.OK).json({
      success: true,
      message: USER_MESSAGES.FETCH_ME_SUCCESS,
      data,
    });
  }

  async getUsersForAdmin(req: Request, res: Response): Promise<void> {
    const data = await this._userService.getUsersForAdmin();

    res.status(HttpStatus.OK).json({
      success: true,
      message: ADMIN_MESSAGES.USERS_FETCHED,
      data,
    });
  }

  async getTrainersForAdmin(req: Request, res: Response): Promise<void> {
    const data = await this._userService.getTrainersForAdmin();

    res.status(HttpStatus.OK).json({
      success: true,
      message: ADMIN_MESSAGES.TRAINERS_FETCHED,
      data,
    });
  }

  async blockUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    await this._userService.blockUser(id);

    res.status(HttpStatus.OK).json({
      success: true,
      message: ADMIN_MESSAGES.USER_BLOCKED,
    });
  }

  async unblockUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    await this._userService.unblockUser(id);

    res.status(HttpStatus.OK).json({
      success: true,
      message: ADMIN_MESSAGES.USER_UNBLOCKED,
    });
  }

  async userOnboarding(req: Request, res: Response): Promise<void> {
    const { id } = requireJwtUser(req);

    const dto = req.body;
    const data = await this._userService.userOnboarding(id, dto);

    res.status(HttpStatus.OK).json({
      success: true,
      message: USER_MESSAGES.ONBOARDING_SUCCESS,
      data,
    });
  }

  async trainerOnboarding(req: Request, res: Response): Promise<void> {
    const { id } = requireJwtUser(req);

    const files = req.files as TrainerMulterFiles;

    const profilePhoto = files.profilePhoto ?? [];
    const certificates = files.certificates ?? [];

    const dto: TrainerOnboardingDTO = req.body;

    const data = await this._userService.trainerOnboarding(
      id,
      dto,
      profilePhoto,
      certificates,
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: TRAINER_MESSAGES.ONBOARDING_SUCCESS,
      data,
    });
  }

  async approveTrainer(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    await this._userService.approveTrainer(id);

    res.status(HttpStatus.OK).json({
      success: true,
      message: ADMIN_MESSAGES.TRAINER_APPROVED,
    });
  }

  async rejectTrainer(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { reason } = req.body;

    await this._userService.rejectTrainer(id, reason);

    res.status(HttpStatus.OK).json({
      success: true,
      message: ADMIN_MESSAGES.TRAINER_REJECTED,
    });
  }
}
