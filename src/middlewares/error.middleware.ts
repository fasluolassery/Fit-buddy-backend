import { Request, Response, NextFunction } from "express";
import { BaseError } from "../common/errors";
import logger from "../utils/logger.util";

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    // eslint-disable-next-line no-unused-vars
    next: NextFunction
) {
    logger.error("Error: ", err);

    if (err instanceof BaseError) {
        return res.status(err.statusCode).json({
            message: err.message,
            code: err.code,
            details: err.details || null,
        });
    }

    return res.status(500).json({
        message: 'Internal Server Error'
    });
}