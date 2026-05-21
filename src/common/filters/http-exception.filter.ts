import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const body = exception.getResponse();
      const extracted =
        typeof body === 'string'
          ? body
          : (body as { message?: string | string[] }).message;
      message = Array.isArray(extracted)
        ? extracted[0]
        : (extracted ?? exception.message);
    }

    res.status(statusCode).json({ statusCode, message, data: null });
  }
}
