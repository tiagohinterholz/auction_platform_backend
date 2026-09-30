import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import {
  DomainException,
  NotFoundDomainException,
} from '../../exceptions/domain.exception';
import { ApiExceptionFilter, toErrorResponse } from '../api-exception.filter';
import { ValidationFailedException } from '../validation';

class InvalidBidPlacedException extends DomainException {}

function uniqueViolation(detail: string): QueryFailedError {
  return new QueryFailedError('INSERT ...', [], {
    code: '23505',
    detail,
  } as never);
}

describe('toErrorResponse', () => {
  it('maps a domain exception to its status and class name', () => {
    const result = toErrorResponse(
      new InvalidBidPlacedException('Lance abaixo do mínimo'),
    );

    expect(result).toEqual({
      status: 400,
      body: {
        message: 'Lance abaixo do mínimo',
        error_type: 'InvalidBidPlacedException',
      },
    });
  });

  it('keeps the status of a domain subclass', () => {
    const result = toErrorResponse(
      new NotFoundDomainException('Auction not found'),
    );

    expect(result.status).toBe(404);
    expect(result.body.error_type).toBe('NotFoundDomainException');
  });

  it('maps validation failures to 422 with every field error', () => {
    const errors = [
      {
        field: 'title',
        message: 'title must be longer than or equal to 5 characters',
      },
      { field: 'startPrice', message: 'startPrice must be a decimal number' },
    ];

    const result = toErrorResponse(new ValidationFailedException(errors));

    expect(result).toEqual({
      status: 422,
      body: {
        message: 'title must be longer than or equal to 5 characters',
        error_type: 'ValidationError',
        errors,
      },
    });
  });

  it.each([
    [new UnauthorizedException(), 401, 'UnauthorizedError'],
    [new ForbiddenException('Admin access required'), 403, 'ForbiddenError'],
    [new NotFoundException('Cannot GET /api/v1/nope'), 404, 'NotFoundError'],
  ])('maps Nest HTTP exceptions (%p)', (exception, status, errorType) => {
    const result = toErrorResponse(exception);

    expect(result.status).toBe(status);
    expect(result.body.error_type).toBe(errorType);
    expect(typeof result.body.message).toBe('string');
  });

  it('maps a duplicate e-mail to 409 with a friendly message', () => {
    const result = toErrorResponse(
      uniqueViolation('Key (email)=(ana@x.com) already exists.'),
    );

    expect(result).toEqual({
      status: 409,
      body: { message: 'E-mail já cadastrado.', error_type: 'IntegrityError' },
    });
  });

  it('falls back to a generic conflict message for other unique columns', () => {
    const result = toErrorResponse(
      uniqueViolation('Key (jti)=(abc) already exists.'),
    );

    expect(result.body.message).toBe(
      'Registro já existe (violação de unicidade).',
    );
  });

  it('hides unknown errors behind a 500 without leaking their message', () => {
    const result = toErrorResponse(
      new Error('connection string with password'),
    );

    expect(result).toEqual({
      status: 500,
      body: {
        message: 'Internal server error',
        error_type: 'InternalServerError',
      },
    });
  });
});

describe('ApiExceptionFilter', () => {
  function fakeHost() {
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
    };
    const host = {
      switchToHttp: () => ({ getResponse: () => response }),
    };
    return { host: host as never, response };
  }

  it('writes the status and envelope to the response', () => {
    const { host, response } = fakeHost();

    new ApiExceptionFilter().catch(new DomainException('Regra violada'), host);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      message: 'Regra violada',
      error_type: 'DomainException',
    });
  });

  it('adds the WWW-Authenticate header on 401', () => {
    const { host, response } = fakeHost();

    new ApiExceptionFilter().catch(new UnauthorizedException(), host);

    expect(response.setHeader).toHaveBeenCalledWith(
      'WWW-Authenticate',
      'Bearer',
    );
  });
});
