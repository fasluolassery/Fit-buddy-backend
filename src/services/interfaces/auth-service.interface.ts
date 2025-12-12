import { IUserDocument } from "../../entities/user.entity";

export default interface IAuthService {
  signup(data: Partial<IUserDocument>): Promise<Partial<IUserDocument>>;
}
