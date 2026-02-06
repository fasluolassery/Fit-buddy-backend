import { Request, Response } from "express";

export default interface ITrainerController {
  onboardTrainer(req: Request, res: Response): Promise<void>;
}
