export const TRAINER_MESSAGES = {
  ONBOARDING_SUCCESS: "Trainer onboarding completed successfully",
} as const;

export const TRAINER_ERROR_MESSAGES = {
  ONBOARDING_ALREADY_COMPLETED:
    "Trainer onboarding has already been completed.",
  PROFILE_NOT_FOUND: "Trainer profile was not found. Please contact support.",
  INVALID_APPROVAL_STATE: "Trainer cannot be approved from the current status.",
  INVALID_REJECTION_STATE:
    "Trainer cannot be rejected from the current status.",
  REJECTION_REASON_REQUIRED: "A valid rejection reason is required.",
  BLOCKED_TRAINER_APPROVAL: "Blocked trainer accounts cannot be approved.",
} as const;
