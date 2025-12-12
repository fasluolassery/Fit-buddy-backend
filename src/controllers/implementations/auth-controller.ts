import { inject, injectable } from "inversify";
import IAuthController from "../interfaces/auth-controller.interface";
import TYPES from "../../constants/types";
import IAuthService from "../../services/interfaces/auth-service.interface";
import { Request, Response } from "express";
import logger from "../../utils/logger.util";
import { HttpStatus } from "../../constants/http-status.constant";

@injectable()
export default class AuthController implements IAuthController {
  constructor(@inject(TYPES.IAuthService) private _authService: IAuthService) {}

  async signup(req: Request, res: Response): Promise<void> {
    try {
      console.log("here");
      // const { name, email } = req.body;
      // logger.info(name, email);
      //   const response = await this._authService.signup(req.body);
      res.status(HttpStatus.OK).json({ msg: "OKAY" });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({ err });
    }
  }
}
