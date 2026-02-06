import { UserDto } from "../../dto/user.dto";
import { UserOnboardingDTO } from "../../validators/onboarding.validator";

export default interface IUserService {
  userOnboarding(userId: string, payload: UserOnboardingDTO): Promise<UserDto>;
}
