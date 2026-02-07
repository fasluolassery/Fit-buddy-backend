import { Request, Response } from "express";
import ITrainerController from "../interfaces/trainer-controller.interface";
import { requireJwtUser } from "../../common/helpers/require-jwt-user";
import { TrainerMulterFiles } from "../../middlewares/validate-files.middleware";
import { HttpStatus } from "../../constants/http-status.constant";
import { TRAINER_MESSAGES } from "../../constants/messages";
import { inject, injectable } from "inversify";
import TYPES from "../../constants/types";
import ITrainerService from "../../services/interfaces/trainer-service.interface";
import { TrainerOnboardReqDto } from "../../dto/trainer.dto";

@injectable()
export default class TrainerController implements ITrainerController {
  constructor(
    @inject(TYPES.ITrainerService) private _trainerService: ITrainerService,
  ) {}
  async onboardTrainer(req: Request, res: Response): Promise<void> {
    const { id } = requireJwtUser(req);

    const files = req.files as TrainerMulterFiles;

    const profilePhoto = files.profilePhoto ?? [];
    const certificates = files.certificates ?? [];

    const trainerOnboardDto: TrainerOnboardReqDto = req.body;

    const data = await this._trainerService.onboardTrainer(
      id,
      trainerOnboardDto,
      profilePhoto,
      certificates,
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: TRAINER_MESSAGES.ONBOARDING_SUCCESS,
      data,
    });
  }
}
