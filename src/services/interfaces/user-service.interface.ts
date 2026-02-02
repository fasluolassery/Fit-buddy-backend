import { UserDto } from "../../dto/user.dto";
import {
  TrainerOnboardingDTO,
  UserOnboardingDTO,
} from "../../validators/onboarding.validator";

export default interface IUserService {
  getMe(userId: string): Promise<UserDto>;
  getUsersForAdmin(): Promise<UserDto[]>;
  blockUser(userId: string): Promise<void>;
  unblockUser(userId: string): Promise<void>;
  userOnboarding(userId: string, payload: UserOnboardingDTO): Promise<UserDto>;
  trainerOnboarding(
    userId: string,
    payload: TrainerOnboardingDTO,
    profilePhoto: Express.Multer.File[],
    certificates: Express.Multer.File[],
  ): Promise<UserDto>;
}
