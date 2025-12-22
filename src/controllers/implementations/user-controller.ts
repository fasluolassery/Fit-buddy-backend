import { Response } from "express";
import IUserController from "../interfaces/user-controller.interface";
import { AuthRequest } from "../../common/types/auth.types";
import { inject } from "inversify";
import TYPES from "../../constants/types";
import IUserService from "../../services/interfaces/user-service.interface";
import { HttpStatus } from "../../constants/http-status.constant";

export default class UserController implements IUserController {
  constructor(@inject(TYPES.IUserService) private _userService: IUserService) {}

  async me(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.user!;

    const data = await this._userService.getMe(id);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "User Data fetched successfully",
      data,
    });
  }
}
