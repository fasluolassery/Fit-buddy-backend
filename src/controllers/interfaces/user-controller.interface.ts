import { Request, Response } from "express";

export default interface IUserController {
  me(req: Request, res: Response): Promise<void>;
}
