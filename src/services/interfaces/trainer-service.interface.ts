import { UserDto } from "../../dto/user.dto";
import { TrainerOnboardingDTO } from "../../validators/onboarding.validator";

export default interface ITrainerService {
  onboardTrainer(
    userId: string,
    payload: TrainerOnboardingDTO,
    profilePhoto: Express.Multer.File[],
    certificates: Express.Multer.File[],
  ): Promise<UserDto>;
}
