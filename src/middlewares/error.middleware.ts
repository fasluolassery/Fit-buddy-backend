import { Request, Response, NextFunction } from "express";
import { BaseError } from "../common/errors";
import logger from "../utils/logger.util";
import { HttpStatus } from "../constants/http-status.constant";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  logger.error(err instanceof Error ? err.message : String(err));

  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
        details: err.details || null,
      },
    });
  }

  // logger.error("Error: ", err.message);

  return res.status(HttpStatus.INTERNAL_ERROR).json({
    success: false,
    error: {
      message: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR",
      details: null,
    },
  });
}
