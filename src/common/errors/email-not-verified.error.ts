import { HttpStatus } from "../../constants/http-status.constant";
import { AUTH_MESSAGES } from "../../constants/messages";
import { BaseError } from "./base-error.error";

export class EmailNotVerifiedError extends BaseError {
  constructor(details?: unknown) {
    super(
      AUTH_MESSAGES.EMAIL_NOT_VERIFIED,
      HttpStatus.UNAUTHORIZED,
      "EMAIL_NOT_VERIFIED",
      details,
    );
  }
}
