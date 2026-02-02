import { Request, Response } from "express";

export default interface IUserController {
  me(req: Request, res: Response): Promise<void>;
  userOnboarding(req: Request, res: Response): Promise<void>;
  trainerOnboarding(req: Request, res: Response): Promise<void>;
  getUsersForAdmin(req: Request, res: Response): Promise<void>;
  blockUser(req: Request, res: Response): Promise<void>;
  unblockUser(req: Request, res: Response): Promise<void>;
}
