export const AUTH_MESSAGES = {
  SIGNUP_SUCCESS_OTP_SENT:
    "Signup successful. A verification code has been sent to your email.",
  EMAIL_VERIFIED_SUCCESS: "Your email has been verified successfully.",
  OTP_RESENT_SUCCESS: "A new verification code has been sent to your email.",
  LOGIN_SUCCESS: "Login successful.",
  LOGOUT_SUCCESS: "You have been logged out successfully.",
  TOKEN_REFRESH_SUCCESS: "Session refreshed successfully.",
  PASSWORD_RESET_LINK_SENT:
    "A password reset link has been sent to your email.",
  PASSWORD_RESET_SUCCESS: "Your password has been reset successfully.",
  GOOGLE_INVALID_ACCOUNT_DATA: "Invalid Google account information.",
  GOOGLE_ACCOUNT_MISMATCH: "The Google account does not match our records.",
  GOOGLE_PASSWORD_CONFLICT:
    "An account already exists with this email. Please log in using your email and password.",
  GOOGLE_ACCOUNT_DISABLED: "This account has been disabled.",
  GOOGLE_ACCOUNT_NOT_FOUND: "No account was found for this Google account.",
  ROLE_REQUIRED_FOR_SIGNUP: "A valid role is required to complete signup.",
  EMAIL_ALREADY_REGISTERED:
    "An account with this email address already exists.",
  INVALID_CREDENTIALS:
    "The email address or password you entered is incorrect.",
  OTP_EXPIRED_OR_INVALID:
    "The verification code is invalid or has expired. Please request a new one.",
  OTP_EXPIRED: "The verification code has expired. Please request a new one.",
  OTP_INVALID: "The verification code you entered is incorrect.",
  ACCOUNT_BLOCKED:
    "This account has been disabled. Please contact support for assistance.",
  EMAIL_ALREADY_VERIFIED: "This email address has already been verified.",
  REFRESH_TOKEN_MISSING: "Your session has expired. Please log in again.",
  USER_NOT_AUTHORIZED: "You are not authorized to perform this action.",
  EMAIL_NOT_VERIFIED: "Please verify your email address to continue.",
  ADMIN_ONLY: "You do not have permission to access this area.",
  RESET_LINK_INVALID:
    "This password reset link is invalid or has expired. Please request a new one.",
} as const;
