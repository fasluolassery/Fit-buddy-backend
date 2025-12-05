import { BaseError } from './base-error.error';
import { HttpStatus } from '../../constants/http-status.constant';

export class BadRequestError extends BaseError {
    constructor(message: string = 'Bad Request', details?: any) {
        super(message, HttpStatus.BAD_REQUEST, 'BAD_REQUEST', details);
    }
}