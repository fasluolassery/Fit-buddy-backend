import { HttpStatus } from "../../constants/http-status.constant";
import { BaseError } from "./base-error.error";

export class ConflictError extends BaseError {
  constructor(message: string = "Conflict Error", details?: unknown) {
    super(message, HttpStatus.CONFLICT, "CONFLICT_ERROR", details);
  }
}
