import { Request, Response } from "express";
import IUserController from "../interfaces/user-controller.interface";
import { inject } from "inversify";
import TYPES from "../../constants/types";
import IUserService from "../../services/interfaces/user-service.interface";
import { HttpStatus } from "../../constants/http-status.constant";
import { requireJwtUser } from "../../common/helpers/require-jwt-user";

export default class UserController implements IUserController {
  constructor(@inject(TYPES.IUserService) private _userService: IUserService) {}

  async me(req: Request, res: Response): Promise<void> {
    const { id } = requireJwtUser(req);

    const data = await this._userService.getMe(id);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "User Data fetched successfully",
      data,
    });
  }

  async getUsersForAdmin(req: Request, res: Response): Promise<void> {
    const data = await this._userService.getUsersForAdmin();

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Users fetched successfully",
      data,
    });
  }
}
