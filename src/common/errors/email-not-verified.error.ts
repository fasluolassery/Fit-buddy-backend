import { HttpStatus } from "../../constants/http-status.constant";
import { BaseError } from "./base-error.error";

export class EmailNotVerifiedError extends BaseError {
  constructor(details?: unknown) {
    super(
      "Email not verified",
      HttpStatus.UNAUTHORIZED,
      "EMAIL_NOT_VERIFIED",
      details,
    );
  }
}
