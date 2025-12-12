import { Request, Response } from "express";

export default interface IAuthController {
  signup(req: Request, res: Response): Promise<void>;
}
