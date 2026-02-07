import { Request, Response } from "express";
import IAdminController from "../interfaces/admin-controller.interface";
import { ADMIN_MESSAGES } from "../../constants/messages";
import { inject, injectable } from "inversify";
import TYPES from "../../constants/types";
import IAdminService from "../../services/interfaces/admin-service.interface";
import { sendSuccess } from "../../common/http/api-response.util";

@injectable()
export default class AdminController implements IAdminController {
  constructor(
    @inject(TYPES.IAdminService) private _adminService: IAdminService,
  ) {}

  async getUsers(req: Request, res: Response): Promise<void> {
    const data = await this._adminService.getAllUsers();

    sendSuccess(res, ADMIN_MESSAGES.USERS_FETCHED, data);
  }

  async getTrainers(req: Request, res: Response): Promise<void> {
    const data = await this._adminService.getAllTrainers();

    sendSuccess(res, ADMIN_MESSAGES.TRAINERS_FETCHED, data);
  }

  async blockUserOrTrainer(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    await this._adminService.blockUserOrTrainer(id);
    sendSuccess(res, ADMIN_MESSAGES.USER_BLOCKED);
  }

  async unblockUserOrTrainer(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    await this._adminService.unblockUserOrTrainer(id);
    sendSuccess(res, ADMIN_MESSAGES.USER_UNBLOCKED);
  }

  async approveTrainer(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    await this._adminService.approveTrainer(id);
    sendSuccess(res, ADMIN_MESSAGES.TRAINER_APPROVED);
  }

  async rejectTrainer(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { reason } = req.body;

    await this._adminService.rejectTrainer(id, reason);
    sendSuccess(res, ADMIN_MESSAGES.TRAINER_REJECTED);
  }
}
