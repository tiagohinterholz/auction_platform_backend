import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { DomainException } from '../exceptions/domain.exception';
import { type FieldError, ValidationFailedException } from './validation';

// Every error leaves the API in one envelope - {message, error_type}, plus
// "errors" on validation failures - the same contract as the FastAPI
// backend, so the front reads a single string field whatever rejected it.
export type ErrorBody = {
  message: string;
  error_type: string;
  errors?: FieldError[];
};

const HTTP_ERROR_TYPES: Record<number, string> = {
  400: 'BadRequestError',
  401: 'UnauthorizedError',
  403: 'ForbiddenError',
  404: 'NotFoundError',
  405: 'MethodNotAllowedError',
  409: 'ConflictError',
};

const UNIQUE_VIOLATION = '23505';
const UNIQUE_FIELD_MESSAGES: Record<string, string> = {
  email: 'E-mail já cadastrado.',
  cpf: 'CPF já cadastrado.',
};
const DEFAULT_CONFLICT_MESSAGE = 'Registro já existe (violação de unicidade).';

function uniqueViolationMessage(driverError: unknown): string {
  // Postgres detail: 'Key (email)=(ana@x.com) already exists.'
  const detail = (driverError as { detail?: string })?.detail ?? '';
  const column = /Key \((\w+)\)/.exec(detail)?.[1];
  return (column && UNIQUE_FIELD_MESSAGES[column]) || DEFAULT_CONFLICT_MESSAGE;
}

function httpExceptionMessage(exception: HttpException): string {
  const response = exception.getResponse();
  if (typeof response === 'string') return response;
  const message = (response as { message?: string | string[] }).message;
  if (Array.isArray(message)) return message[0] ?? exception.message;
  return message ?? exception.message;
}

/** Pure mapping, kept apart from the Express response so it's testable alone. */
export function toErrorResponse(exception: unknown): {
  status: number;
  body: ErrorBody;
} {
  if (exception instanceof ValidationFailedException) {
    return {
      status: 422,
      body: {
        message: exception.message,
        error_type: 'ValidationError',
        errors: exception.errors,
      },
    };
  }

  if (exception instanceof DomainException) {
    return {
      status: exception.statusCode,
      body: { message: exception.message, error_type: exception.name },
    };
  }

  if (
    exception instanceof QueryFailedError &&
    (exception.driverError as { code?: string })?.code === UNIQUE_VIOLATION
  ) {
    return {
      status: 409,
      body: {
        message: uniqueViolationMessage(exception.driverError),
        error_type: 'IntegrityError',
      },
    };
  }

  if (exception instanceof HttpException) {
    const status = exception.getStatus();
    return {
      status,
      body: {
        message: httpExceptionMessage(exception),
        error_type: HTTP_ERROR_TYPES[status] ?? 'HTTPError',
      },
    };
  }

  return {
    status: 500,
    body: {
      message: 'Internal server error',
      error_type: 'InternalServerError',
    },
  };
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const { status, body } = toErrorResponse(exception);

    if (status >= 500) {
      this.logger.error(
        exception instanceof Error ? exception.stack : String(exception),
      );
    }
    if (status === 401) {
      response.setHeader('WWW-Authenticate', 'Bearer');
    }

    response.status(status).json(body);
  }
}
