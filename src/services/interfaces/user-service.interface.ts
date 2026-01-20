import { UserDto } from "../../dto/user.dto";

// /* eslint-disable @typescript-eslint/no-empty-object-type */
export default interface IUserService {
  getMe(userId: string): Promise<UserDto>;
}
