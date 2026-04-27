import { IsEnum, IsString, IsUUID } from 'class-validator';
import { UserRole } from '../../domain/enums/user-role.enum';

export class UserResponseDto {
  @IsUUID()
  readonly id: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly email: string;

  @IsEnum({ enum: UserRole })
  readonly role: UserRole;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
