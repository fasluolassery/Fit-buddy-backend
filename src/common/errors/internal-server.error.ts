import { HttpStatus } from "../../constants/http-status.constant";
import { BaseError } from "./base-error.error";

export class InternalServerError extends BaseError {
  constructor(message: string = "Internal Server Error", details?: unknown) {
    super(message, HttpStatus.INTERNAL_ERROR, "INTERNAL_SERVER_ERROR", details);
  }
}
