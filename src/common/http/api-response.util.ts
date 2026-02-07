import { Response } from "express";
import {
  HttpStatus,
  HttpStatusCode,
} from "../../constants/http-status.constant";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export function sendSuccess<T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: HttpStatusCode = HttpStatus.OK,
): void {
  const response: ApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
  };

  res.status(statusCode).json(response);
}
