import { Request, Response } from "express";

export default interface IUserController {
  userOnboarding(req: Request, res: Response): Promise<void>;
}
