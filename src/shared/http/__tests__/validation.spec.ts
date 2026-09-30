import { IsString, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import {
  flattenValidationErrors,
  validationExceptionFactory,
} from '../validation';

class AddressDto {
  @IsString()
  city!: string;
}

class CreateThingDto {
  @Length(5, 200)
  title!: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;
}

async function errorsFor(payload: object) {
  return validate(plainToInstance(CreateThingDto, payload));
}

describe('flattenValidationErrors', () => {
  it('lists one entry per failed constraint, with the field name', async () => {
    const errors = await errorsFor({ title: 'abc', address: { city: 'Poa' } });

    expect(flattenValidationErrors(errors)).toEqual([
      {
        field: 'title',
        message: 'title must be longer than or equal to 5 characters',
      },
    ]);
  });

  it('uses a dotted path for nested fields', async () => {
    const errors = await errorsFor({
      title: 'valid title',
      address: { city: 1 },
    });

    expect(flattenValidationErrors(errors)).toEqual([
      { field: 'address.city', message: 'city must be a string' },
    ]);
  });
});

describe('validationExceptionFactory', () => {
  it('builds a 422 whose message is the first field error', async () => {
    const errors = await errorsFor({ title: 'abc', address: { city: 1 } });

    const exception = validationExceptionFactory(errors);

    expect(exception.getStatus()).toBe(422);
    expect(exception.message).toBe(
      'title must be longer than or equal to 5 characters',
    );
    expect(exception.errors).toHaveLength(2);
  });
});
