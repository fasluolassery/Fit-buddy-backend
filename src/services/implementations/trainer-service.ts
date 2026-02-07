import { inject, injectable } from "inversify";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../common/errors";
import {
  TRAINER_ERROR_MESSAGES,
  USER_ERROR_MESSAGES,
} from "../../constants/messages";
import { AuthUserDto } from "../../dto/user.dto";
import ITrainerService from "../interfaces/trainer-service.interface";
import TYPES from "../../constants/types";
import IUserRepository from "../../repositories/interfaces/user-repository.interface";
import ITrainerRepository from "../../repositories/interfaces/trainer-repository.interface";
import { AuthMapper } from "../../mappers/auth.mapper";
import { TrainerOnboardReqDto } from "../../dto/trainer.dto";

@injectable()
export default class TrainerService implements ITrainerService {
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.ITrainerRepository)
    private _trainerRepository: ITrainerRepository,
  ) {}

  async onboardTrainer(
    userId: string,
    payload: TrainerOnboardReqDto,
    profilePhoto: Express.Multer.File[],
    certificates: Express.Multer.File[],
  ): Promise<AuthUserDto> {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new NotFoundError(USER_ERROR_MESSAGES.NOT_FOUND);

    if (user.role !== "trainer") {
      throw new BadRequestError(USER_ERROR_MESSAGES.TRAINER_ONLY_ACTION);
    }

    if (user.onboardingComplete)
      throw new ConflictError(
        TRAINER_ERROR_MESSAGES.ONBOARDING_ALREADY_COMPLETED,
      );

    const { _id } = user;
    const { bio, specializations, experience } = payload;

    const profilePhotoPath = profilePhoto[0].path;
    const certificatePaths = certificates.map((file) => file.path);

    await this._trainerRepository.create({
      userId: _id,
      bio,
      specializations,
      experienceYears: experience,
      certificates: certificatePaths,
    });

    user.profilePhoto = profilePhotoPath;
    user.trainerApprovalStatus = "pending";
    user.onboardingComplete = true;

    await user.save();

    return AuthMapper.toAuthUserDto(user);
  }
}
