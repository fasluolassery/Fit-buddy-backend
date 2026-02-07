import { inject, injectable } from "inversify";
import IAdminService from "../interfaces/admin-service.interface";
import TYPES from "../../constants/types";
import IUserRepository from "../../repositories/interfaces/user-repository.interface";
import ITrainerRepository from "../../repositories/interfaces/trainer-repository.interface";
import { BadRequestError, NotFoundError } from "../../common/errors";
import {
  ADMIN_ERROR_MESSAGES,
  TRAINER_ERROR_MESSAGES,
  USER_ERROR_MESSAGES,
} from "../../constants/messages";
import { AdminTrainerListDto, AdminUserListDto } from "../../dto/admin.dto";
import { AdminMapper } from "../../mappers/admin.mapper";

@injectable()
export default class AdminService implements IAdminService {
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.ITrainerRepository)
    private _trainerRepository: ITrainerRepository,
  ) {}

  async getAllUsers(): Promise<AdminUserListDto[]> {
    const users = await this._userRepository.findUserByRole("user");
    return users.map(AdminMapper.toAdminUserDto);
  }

  async getAllTrainers(): Promise<AdminTrainerListDto[]> {
    const trainerUsers = await this._userRepository.findUserByRole("trainer");
    const trainerProfiles = await this._trainerRepository.findByUserIds(
      trainerUsers.map((u) => u._id.toString()),
    );

    const trainerMap = new Map(
      trainerProfiles.map((t) => [t.userId.toString(), t]),
    );

    return trainerUsers.map((user) =>
      AdminMapper.toAdminTrainerDto(user, trainerMap.get(user._id.toString())),
    );
  }

  async blockUserOrTrainer(userId: string): Promise<void> {
    const user = await this._userRepository.findById(userId);

    if (!user) throw new NotFoundError(USER_ERROR_MESSAGES.NOT_FOUND);
    if (user.role === "admin")
      throw new BadRequestError(USER_ERROR_MESSAGES.ADMIN_BLOCK_NOT_ALLOWED);
    if (user.isBlocked) return;

    const { _id } = user;
    await this._userRepository.updateById(_id, {
      isBlocked: true,
    });
  }

  async unblockUserOrTrainer(userId: string): Promise<void> {
    const user = await this._userRepository.findById(userId);

    if (!user) throw new NotFoundError(USER_ERROR_MESSAGES.NOT_FOUND);
    if (!user.isBlocked) return;

    const { _id } = user;
    await this._userRepository.updateById(_id, {
      isBlocked: false,
    });
  }

  async approveTrainer(userId: string): Promise<void> {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new NotFoundError(USER_ERROR_MESSAGES.NOT_FOUND);

    if (user.role !== "trainer") {
      throw new BadRequestError(ADMIN_ERROR_MESSAGES.USER_NOT_TRAINER);
    }

    if (user.isBlocked) {
      throw new BadRequestError(
        TRAINER_ERROR_MESSAGES.BLOCKED_TRAINER_APPROVAL,
      );
    }

    if (user.trainerApprovalStatus === "approved") {
      return;
    }

    if (user.trainerApprovalStatus !== "pending") {
      throw new BadRequestError(TRAINER_ERROR_MESSAGES.INVALID_APPROVAL_STATE, {
        status: user.trainerApprovalStatus,
      });
    }

    const trainerProfile = await this._trainerRepository.findByUserId(
      user._id.toString(),
    );

    if (!trainerProfile) {
      throw new NotFoundError(TRAINER_ERROR_MESSAGES.PROFILE_NOT_FOUND);
    }

    await this._userRepository.updateById(user._id, {
      trainerApprovalStatus: "approved",
      trainerRejectionReason: null,
    });
  }

  async rejectTrainer(userId: string, reason: string): Promise<void> {
    if (!reason || reason.trim().length < 3) {
      throw new BadRequestError(
        TRAINER_ERROR_MESSAGES.REJECTION_REASON_REQUIRED,
      );
    }

    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(USER_ERROR_MESSAGES.NOT_FOUND);
    }

    if (user.role !== "trainer") {
      throw new BadRequestError(ADMIN_ERROR_MESSAGES.USER_NOT_TRAINER);
    }

    if (user.trainerApprovalStatus === "rejected") {
      return;
    }
    if (user.trainerApprovalStatus !== "pending") {
      throw new BadRequestError(
        TRAINER_ERROR_MESSAGES.INVALID_REJECTION_STATE,
        { status: user.trainerApprovalStatus },
      );
    }

    const trainerProfile = await this._trainerRepository.findByUserId(
      user._id.toString(),
    );

    if (!trainerProfile) {
      throw new NotFoundError(TRAINER_ERROR_MESSAGES.PROFILE_NOT_FOUND);
    }

    await this._userRepository.updateById(user._id, {
      trainerApprovalStatus: "rejected",
      trainerRejectionReason: reason,
    });
  }
}
