import { TrainerOnboardReqDto } from "../../dto/trainer.dto";
import { AuthUserDto } from "../../dto/user.dto";

export default interface ITrainerService {
  onboardTrainer(
    userId: string,
    payload: TrainerOnboardReqDto,
    profilePhoto: Express.Multer.File[],
    certificates: Express.Multer.File[],
  ): Promise<AuthUserDto>;
}
