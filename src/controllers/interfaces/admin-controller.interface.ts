import { Request, Response } from "express";

export default interface IAdminController {
  getUsers(req: Request, res: Response): Promise<void>;
  getTrainers(req: Request, res: Response): Promise<void>;
  blockUserOrTrainer(req: Request, res: Response): Promise<void>;
  unblockUserOrTrainer(req: Request, res: Response): Promise<void>;
  approveTrainer(req: Request, res: Response): Promise<void>;
  rejectTrainer(req: Request, res: Response): Promise<void>;
}
