import { BaseError } from "./base-error.error";
import { HttpStatus } from "../../constants/http-status.constant";

export class NotFoundError extends BaseError {
  constructor(message: string = "Not Found", details?: unknown) {
    super(message, HttpStatus.NOT_FOUND, "NOT_FOUND", details);
  }
}
