import { BaseError } from "./base-error.error";
import { HttpStatus } from "../../constants/http-status.constant";

export class ValidationError extends BaseError {
  constructor(message: string = "Validation Error", details?: unknown) {
    super(message, HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", details);
  }
}
