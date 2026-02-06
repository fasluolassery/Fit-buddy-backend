// user.messages.ts
export const USER_MESSAGES = {
  FETCH_ME_SUCCESS: "User data fetched successfully",
  ONBOARDING_SUCCESS: "User onboarding completed successfully",
} as const;

export const USER_ERROR_MESSAGES = {
  NOT_FOUND: "User account was not found.",
  ALREADY_ONBOARDED: "User onboarding has already been completed.",
  ADMIN_BLOCK_NOT_ALLOWED: "Administrator accounts cannot be blocked.",
  TRAINER_ONLY_ACTION: "This action is allowed only for trainer accounts.",
} as const;
