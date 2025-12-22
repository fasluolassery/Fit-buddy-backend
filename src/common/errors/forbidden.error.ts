import { HttpStatus } from "../../constants/http-status.constant";
import { BaseError } from "./base-error.error";

export class ForbiddenError extends BaseError {
  constructor(message: string = "Access denied", details?: unknown) {
    super(message, HttpStatus.FORBIDDEN, "FORBIDDEN", details);
  }
}
