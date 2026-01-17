import {
  ConflictError,
  UnauthorizedError,
  BadRequestError,
} from "../../common/errors";

export function mapGoogleAuthError(err: unknown): string {
  if (err instanceof ConflictError) return "ACCOUNT_EXISTS";
  if (err instanceof UnauthorizedError) return "UNAUTHORIZED";
  if (err instanceof BadRequestError) return "BAD_REQUEST";
  return "GOOGLE_AUTH_FAILED";
}
