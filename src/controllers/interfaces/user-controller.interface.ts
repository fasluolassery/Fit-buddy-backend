import { Response } from "express";
import { AuthRequest } from "../../common/types/auth.types";

export default interface IUserController {
  me(req: AuthRequest, res: Response): Promise<void>;
}
