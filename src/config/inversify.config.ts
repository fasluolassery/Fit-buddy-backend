import { Container } from "inversify";
import TYPES from "../constants/types";
import userModel from "../models/user.model";
import UserRepository from "../repositories/implementations/user-repository";
import IUserRepository from "../repositories/interfaces/user-repository.interface";
import AuthController from "../controllers/implementations/auth-controller";
import IAuthController from "../controllers/interfaces/auth-controller.interface";
import AuthService from "../services/implementations/auth-service";
import IAuthService from "../services/interfaces/auth-service.interface";

const container = new Container();

container.bind(TYPES.userModel).toConstantValue(userModel);
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<IAuthController>(TYPES.IAuthController).to(AuthController);
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);

export default container;
