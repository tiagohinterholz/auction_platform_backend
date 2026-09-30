// Base for every business-rule failure. Kept free of any Nest import so the
// domain layer can throw it; the HTTP status it maps to is read by the global
// exception filter, mirroring the FastAPI backend's DomainException.

export class DomainException extends Error {
  readonly statusCode: number = 400;

  constructor(message: string) {
    super(message);
    // new.target is the class actually instantiated, so every subclass gets
    // its own name (sent to clients as "error_type") without repeating it.
    this.name = new.target.name;
  }
}

/** The referenced resource doesn't exist. */
export class NotFoundDomainException extends DomainException {
  override readonly statusCode = 404;
}

/** Credentials or token missing, invalid or expired. */
export class UnauthorizedDomainException extends DomainException {
  override readonly statusCode = 401;
}

/** Authenticated, but not allowed to do this. */
export class ForbiddenDomainException extends DomainException {
  override readonly statusCode = 403;
}

/** The request conflicts with the current state (duplicate, resource locked). */
export class ConflictDomainException extends DomainException {
  override readonly statusCode = 409;
}
