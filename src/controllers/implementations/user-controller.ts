import { Request, Response } from "express";
import IUserController from "../interfaces/user-controller.interface";
import { inject } from "inversify";
import TYPES from "../../constants/types";
import IUserService from "../../services/interfaces/user-service.interface";
import { HttpStatus } from "../../constants/http-status.constant";
import { requireJwtUser } from "../../common/helpers/require-jwt-user";
import { USER_MESSAGES } from "../../constants/messages";

export default class UserController implements IUserController {
  constructor(@inject(TYPES.IUserService) private _userService: IUserService) {}

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
}
