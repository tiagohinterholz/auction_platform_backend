import {
  ConflictDomainException,
  DomainException,
  ForbiddenDomainException,
  NotFoundDomainException,
  UnauthorizedDomainException,
} from '../domain.exception';

class InvalidBidPlacedException extends DomainException {}

describe('DomainException', () => {
  it('defaults to 400 and exposes the message', () => {
    const error = new DomainException('Regra violada');

    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Regra violada');
    expect(error).toBeInstanceOf(Error);
  });

  it('names each subclass after itself, without setting the name by hand', () => {
    const error = new InvalidBidPlacedException('Lance abaixo do mínimo');

    expect(error.name).toBe('InvalidBidPlacedException');
    expect(error.statusCode).toBe(400);
    expect(error).toBeInstanceOf(DomainException);
  });

  it.each([
    [NotFoundDomainException, 404],
    [UnauthorizedDomainException, 401],
    [ForbiddenDomainException, 403],
    [ConflictDomainException, 409],
  ])('%p maps to HTTP %i', (ExceptionClass, status) => {
    const error = new ExceptionClass('x');

    expect(error.statusCode).toBe(status);
    expect(error).toBeInstanceOf(DomainException);
  });
});
