import { AuthUserDto, UserOnboardingReqDto } from "../../dto/user.dto";

export default interface IUserService {
  userOnboarding(
    userId: string,
    payload: UserOnboardingReqDto,
  ): Promise<AuthUserDto>;
}
