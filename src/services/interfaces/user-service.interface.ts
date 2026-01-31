import { UserDto } from "../../dto/user.dto";
import { UserOnboardingDTO } from "../../validators/onboarding.validator";

export default interface IUserService {
  getMe(userId: string): Promise<UserDto>;
  getUsersForAdmin(): Promise<UserDto[]>;
  blockUser(userId: string): Promise<void>;
  unblockUser(userId: string): Promise<void>;
  userOnboarding(userId: string, payload: UserOnboardingDTO): Promise<void>;
}
