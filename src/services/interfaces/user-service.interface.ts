import { UserDto } from "../../dto/user.dto";

export default interface IUserService {
  getMe(userId: string): Promise<UserDto>;
  getUsersForAdmin(): Promise<UserDto[]>;
}
