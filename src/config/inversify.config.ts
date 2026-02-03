import { Container } from "inversify";
import TYPES from "../constants/types";
import userModel from "../models/user.model";
import UserRepository from "../repositories/implementations/user-repository";
import IUserRepository from "../repositories/interfaces/user-repository.interface";
import AuthController from "../controllers/implementations/auth-controller";
import IAuthController from "../controllers/interfaces/auth-controller.interface";
import AuthService from "../services/implementations/auth-service";
import IAuthService from "../services/interfaces/auth-service.interface";
import otpModel from "../models/otp.model";
import OtpRepository from "../repositories/implementations/otp-repository";
import IOtpRepository from "../repositories/interfaces/otp-repository.interface";
import UserService from "../services/implementations/user-service";
import IUserService from "../services/interfaces/user-service.interface";
import IUserController from "../controllers/interfaces/user-controller.interface";
import UserController from "../controllers/implementations/user-controller";
import passwordResetModel from "../models/password-reset.model";
import PasswordResetRepository from "../repositories/implementations/password-reset-repository";
import IPasswordResetRepository from "../repositories/interfaces/password-reset-repository.interface";
import ITrainerRepository from "../repositories/interfaces/trainer-repository.interface";
import trainerModel from "../models/trainer.model";
import TrainerRepository from "../repositories/implementations/trainer-repository";

const container = new Container();

container.bind(TYPES.userModel).toConstantValue(userModel);
container.bind(TYPES.trainerModel).toConstantValue(trainerModel);

container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container
  .bind<ITrainerRepository>(TYPES.ITrainerRepository)
  .to(TrainerRepository);

container.bind<IAuthController>(TYPES.IAuthController).to(AuthController);
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);

container.bind<IUserService>(TYPES.IUserService).to(UserService);
container.bind<IUserController>(TYPES.IUserController).to(UserController);

container.bind(TYPES.otpModel).toConstantValue(otpModel);
container.bind<IOtpRepository>(TYPES.IOtpRepository).to(OtpRepository);

container.bind(TYPES.passwordResetModel).toConstantValue(passwordResetModel);
container
  .bind<IPasswordResetRepository>(TYPES.IPasswordResetRepository)
  .to(PasswordResetRepository);

export default container;
