import { Request, Response, NextFunction } from "express";
import { BaseError } from "../common/errors";
import logger from "../utils/logger.util";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  logger.error("Error: " + (err instanceof Error ? err.message : String(err)));

  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
      details: err.details || null,
    });
  }
  // logger.error("Error: ", err);

  return res.status(500).json({
    message: "Internal Server Error",
  });
}
