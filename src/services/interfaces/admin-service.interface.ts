import { AdminTrainerDto, UserDto } from "../../dto/user.dto";

export default interface IAdminService {
  getAllUsers(): Promise<UserDto[]>;
  getAllTrainers(): Promise<AdminTrainerDto[]>;
  blockUserOrTrainer(userId: string): Promise<void>;
  unblockUserOrTrainer(userId: string): Promise<void>;
  approveTrainer(userId: string): Promise<void>;
  rejectTrainer(userId: string, reason: string): Promise<void>;
}
