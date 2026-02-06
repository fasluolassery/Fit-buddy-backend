export const ADMIN_MESSAGES = {
  USERS_FETCHED: "Users fetched successfully",
  TRAINERS_FETCHED: "Trainers fetched successfully",
  USER_BLOCKED: "User blocked successfully",
  USER_UNBLOCKED: "User unblocked successfully",
  TRAINER_APPROVED: "Trainer approved successfully",
  TRAINER_REJECTED: "Trainer rejected successfully",
} as const;

export const ADMIN_ERROR_MESSAGES = {
  USER_NOT_TRAINER: "The selected user is not a trainer.",
} as const;
