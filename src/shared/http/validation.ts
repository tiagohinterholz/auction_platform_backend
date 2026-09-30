import { UnprocessableEntityException } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

export type FieldError = { field: string; message: string };

/** class-validator nests errors for nested DTOs; clients want a flat list. */
export function flattenValidationErrors(
  errors: ValidationError[],
  parent = '',
): FieldError[] {
  return errors.flatMap((error) => {
    const field = parent ? `${parent}.${error.property}` : error.property;
    const own = Object.values(error.constraints ?? {}).map((message) => ({
      field,
      message,
    }));
    return [...own, ...flattenValidationErrors(error.children ?? [], field)];
  });
}

/** Body/params failed validation: 422, same shape as the FastAPI backend. */
export class ValidationFailedException extends UnprocessableEntityException {
  constructor(readonly errors: FieldError[]) {
    // class-validator messages already name the field
    // ("title must be longer than..."), so the first one reads fine alone.
    super(errors[0]?.message ?? 'Invalid request.');
  }
}

/** Plugged into ValidationPipe({ exceptionFactory }) in main.ts. */
export function validationExceptionFactory(
  errors: ValidationError[],
): ValidationFailedException {
  return new ValidationFailedException(flattenValidationErrors(errors));
}
