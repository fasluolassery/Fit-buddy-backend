import { BaseError } from "./base-error.error";
import { HttpStatus } from "../../constants/http-status.constant";

export class UnauthorizedError extends BaseError {
    constructor(message: string = "Unauthorized", code?: string, details?: any) {
        super(message, HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", details);
    }
}   