import { AdminTrainerListDto, AdminUserListDto } from "../../dto/admin.dto";

export default interface IAdminService {
  getAllUsers(): Promise<AdminUserListDto[]>;
  getAllTrainers(): Promise<AdminTrainerListDto[]>;
  blockUserOrTrainer(userId: string): Promise<void>;
  unblockUserOrTrainer(userId: string): Promise<void>;
  approveTrainer(userId: string): Promise<void>;
  rejectTrainer(userId: string, reason: string): Promise<void>;
}
